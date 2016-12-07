import cookie from 'react-cookie';
import DropDownComponent from 'components/dropdown/DropdownComponert.jsx'
class ModalWindowComponent extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            checked: this.props.allowNotification,
            keyWords: this.props.keys
        }
    }

    componentDidMount() {
        var self = this;
        $('.ui.modal').modal({detachable: false});
        $('.ui.checkbox').checkbox();
        $(".ui.checkbox").on("change", function () {
            var checked = $(this).find('input').is(':checked')
            cookie.save('allowNotification', checked);
            self.setState({"checked": checked})
            self.props.onChangeNotificationSettings(checked, self.state.keyWords)
        })

    }

    onModal() {
        $('.ui.modal.editform').modal('show');
    }

    onKeysChange(keys) {
        this.setState({"keyWords": keys});
        cookie.save('keyWords', keys);
        this.props.onChangeNotificationSettings(this.state.checked, keys)
    }


    shouldComponentUpdate(nextProps, nextState) {

        return !_.isEqual(JSON.stringify(this.props), JSON.stringify(nextProps))
    }

    componentDidUpdate() {
        $('#notificationsAllow').prop('checked', this.props.allowNotification);
    }

    render() {
        var checked = (this.props.allowNotification) ? "checked" : "";

        var locations = this.props.locations.map(function (location) {
            return location["name"]
        });

        var switchValue = (this.props.allowNotification) ? "Off" : "On"
        var labelText = 'Turn notifications "' + switchValue + '"';
        return (
            <div>
                <button className="ui settings labeled icon basic button" onClick={this.onModal}>
                    <i className="settings arrow icon"></i>
                    Notifications settings
                </button>
                <div className="ui modal editform">
                    <div className="header">Notification settings</div>
                    <div className="content">
                        <div className="ui toggle checkbox ">
                            <input
                                id="notificationsAllow"
                                type="checkbox"
                                name="public"
                                defaultChecked={checked}

                            />
                            <label>{labelText}</label>
                        </div>
                        <br/>
                        <h5>Select locations below to limit notifications by state.</h5>
                        <DropDownComponent
                            fields={locations}
                            multiple={true}
                            fluid={true}
                            id="locations"
                            dropdownTitle="Select location(s)"
                            onKeysChange={(keys) => this.onKeysChange(keys)}
                            defaultValue={this.props.keys}

                        />
                    </div>
                </div>
            </div>
        )
    }
}

module.exports = ModalWindowComponent;


