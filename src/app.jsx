import TableComponent from 'components/table/TableComponent.jsx';
import ModalWindowComponent from 'components/modal/ModalWindowComponent.jsx';
import cookie from 'react-cookie';
import Urls from 'urls/Urls.jsx';
import HTTP from 'http/HTTP.jsx';

class App extends React.Component {

    interval: 1;

    constructor(props) {
        super(props);
        this.state = {
            browserNotificationAllowed: null,
            socketUrl: props.socketUrl,
            tableDataUrl: props.tableDataUrl,
            locationsUrl: props.locationsUrl,
            firmsUrl: props.firmsUrl,
            tokenUrl: props.tokenDataUrl,

            locations: null,
            firms: null,
            jobs: null,
            allowNotification: null,
            notificationLocationKeyWords: null,
            notificationFirmKeyWords: null,
            token: null,
            auth: true,
            notificationGranted: false
        };
    }

    alphabeticalSortArray(array) {
        return array.sort(function (a, b) {
            a = a.firm.toLowerCase();
            b = b.firm.toLowerCase();
            return a < b ? -1 : a > b ? 1 : 0;
        });
    }

    filterNotifibleJobs(value) {
        if (!_.isEmpty(this.state.notificationFirmKeyWords)) {
            var blackListFirms = this.state.notificationFirmKeyWords.split(',');
            if (blackListFirms.includes(value.firm)) {
                return false;
            }

        }

        if (!_.isEmpty(this.state.notificationLocationKeyWords)) {
            var jobContainsNotifyKey = false;
            var keysArray = this.state.notificationLocationKeyWords.split(',');
            for (var i = 0; i < keysArray.length; i++) {
                var key = keysArray[i].toLowerCase().replace(/[^a-zA-Z]+/g, '');
                var jobLocation = value["location"].toLowerCase().replace(/[^a-zA-Z]+/g, '')
                if (jobLocation.indexOf(key) != -1) {
                    jobContainsNotifyKey = true;
                    break;
                }
            }
            return jobContainsNotifyKey;
        }
        return true;

    }

    onNewJobsData(newJobs) {
        if (_.isNull(this.state.jobs)) {
            this.setState({"jobs": newJobs})
        }
        else {
            var jobfForNotification = newJobs.filter(this.filterNotifibleJobs.bind(this));
            if (!_.isEmpty(jobfForNotification)) {
                this.showNotification(jobfForNotification)
            }
            var updatedJobsArray = newJobs.concat(this.state.jobs);
            this.setState({"jobs": updatedJobsArray})
        }
    }

    getTableRestData(url) {
        var self = this;
        HTTP.GET(url).then(function (data) {
            self.onNewJobsData(JSON.parse(data["body"]))
        });
    }

    getTableSocketData(token) {
        var self = this;
        var stompClient = {
            client: null,
            socket: null,
            connect: function () {
                this.socket = new SockJS(self.state.socketUrl + "?" + "token=" + token);
                this.client = Stomp.over(this.socket);

                this.client.connect({}, function (frame) {
                    stompClient.client.subscribe('/topic/openings/update', function (events) {
                        stompClient.consume(events);
                    });
                });
            },
            consume: function (raw) {
                var jobs = JSON.parse(raw["body"]);
                if (!_.isEmpty(jobs)) {
                    self.onNewJobsData(self.alphabeticalSortArray(jobs));
                }
            },
            close: function () {
                if (this.client != null && this.client != undefined) {
                    this.client.unsubscribe('/topic/openings/update');
                    this.client.disconnect();
                    this.client = null;
                }
            }
        };
        stompClient.connect();
    }

    deleteJob(id) {
        var test = this.state.jobs.filter(element => element.id != id);
        if (!_.isEqual(test, this.state.jobs)) {
            this.setState({"jobs": test})
        }
    }

    isSupported(win) {
        var isSupported = false;
        try {
            isSupported = !!(win.Notification || win.webkitNotifications || navigator.mozNotification);
        } catch (e) {
            console.log(e);
        }
        return isSupported
    }


    showNotification(urlsArray) {
        console.log(this.state.allowNotification)
        if (this.isSupported(window) && this.state.allowNotification) {
            if (Notification.permission === "granted") {
                var openings = urlsArray.slice(0, 2).map(function (job) {
                    return "-" + [job["title"], job["firm"], job["location"]].filter(jobAttr =>!_.isEmpty(jobAttr)).join(" - ")
                });

                var seeMoreOption = (openings.length > 3) ? "\n See more..." : ""

                var notification = new Notification("***Job Alert***", {
                    dir: "auto",
                    lang: "",
                    body: "\n" + openings.join("\n") + seeMoreOption,
                    icon: 'https://www.firmprospects.com/images/img/logo.png',
                });
                notification.onclick = function () {
                    window.focus();
                    this.close();
                };
            }
        }
    }

    askPrimaryNotificationPermissions() {
        if (this.isSupported(window)) {
            if (!this.isNotificationDenied()) {
                Notification.requestPermission(function (permission) {
                });
            }
        }
    }

    isNotificationDenied() {
        return (Notification.permission == 'denied')
    }

    blockNotificationAttention() {
        $.jGrowl("Notifications are blocked. Please enable them in your browser.", {
            sticky: true
        });
    }

    onChangeNotificationSettings(allow, locationKeys, firmsKeys) {
        if (allow && this.isNotificationDenied()) {
            this.blockNotificationAttention()
        }
        this.askPrimaryNotificationPermissions()
        this.setState({
            "allowNotification": allow,
            "notificationLocationKeyWords": locationKeys,
            "notificationFirmKeyWords": firmsKeys
        })
    }

    componentWillMount() {
        if (this.isSupported(window)){
            this.askPrimaryNotificationPermissions();

            var allowNotification = (_.isUndefined(cookie.load('allowNotification'))) ?
            Notification.permission == 'granted' : cookie.load('allowNotification');

            var locationsKeyWords = (_.isUndefined(cookie.load('locationsKeyWords'))) ? null : cookie.load('locationsKeyWords');
            var firmKeyWords = (_.isUndefined(cookie.load('firmKeyWords'))) ? null : cookie.load('firmKeyWords');

            if (allowNotification && this.isNotificationDenied()) {
                this.blockNotificationAttention()
            }
            this.setState({
                "browserNotificationAllowed": true,
                "allowNotification": allowNotification,
                "notificationLocationKeyWords": locationsKeyWords,
                "notificationFirmKeyWords": firmKeyWords,
            });
        }
        else {
            this.setState({
                "browserNotificationAllowed": false,
                "allowNotification": null,
                "notificationLocationKeyWords": null,
                "notificationFirmKeyWords": null,
            });
        }

    }

    checkPermission() {
        if (Notification.permission == 'granted') {
            this.setState({
                "allowNotification": true
            });
            clearInterval(this.interval)
        }
    }

    componentDidMount() {
        var self = this;
        HTTP.GET(this.state.tokenUrl).then(
            function (data) {
                var token = data["token"];
                self.setState({"auth": true});
                self.getTableRestData(self.state.tableDataUrl + "?" + "token=" + token);
                self.getTableSocketData(token);
                HTTP.GET(self.state.locationsUrl + "?" + "token=" + token).then(function (data) {
                    self.setState({"locations": data})
                });
                HTTP.GET(self.state.firmsUrl + "?" + "token=" + token).then(function (data) {
                    self.setState({"firms": data})
                });
                if (Notification.permission !== 'denied' && Notification.permission !== 'granted') {
                    this.interval = setInterval(self.checkPermission.bind(self), 500)
                }
            }, function () {
                self.setState({"auth": false})
            }
        );
    }

    render() {
        var modal = (this.state.browserNotificationAllowed &&!_.isNull(this.state.locations) && !_.isNull(this.state.firms)) ?
            <ModalWindowComponent
                onChangeNotificationSettings={(allow, locations, firms) => this.onChangeNotificationSettings(allow, locations, firms)}
                allowNotification={this.state.allowNotification}
                locations={this.state.locations}
                firms={this.state.firms}
                locationKeys={this.state.notificationLocationKeyWords}
                firmKeys={this.state.notificationFirmKeyWords}
            /> :
            "";

        if (!_.isNull(this.state.jobs)) {
            return (
                <div>
                    {modal}
                    <TableComponent
                        data={this.state.jobs}
                        deleteJob={this.deleteJob.bind(this)}
                    />
                </div>
            )
        }
        if (!this.state.auth) {
            return (
                <div className="ui huge negative message">
                    <div className="header">
                        Forbidden
                    </div>
                    <p>It seems you are not authorized user. You should firstly login into the system to get data! </p>
                </div>
            )
        }
        return (
            <div className="ui active inverted dimmer">
                <div className="ui massive text loader">Loading</div>
            </div>
        )
    }
}

App.defaultProps = {
    socketUrl: Urls.socketUrl,
    tableDataUrl: Urls.tableData,
    tokenDataUrl: Urls.token,
    locationsUrl: Urls.locations,
    firmsUrl: Urls.firms
};


ReactDOM.render(
    <App />, document.getElementById('app')
);

module.exports = App;

