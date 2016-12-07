import moment from 'moment';

class JobsAppearedTimeComponent extends React.Component {
    interval: 1;

    getDataDiff(now, then) {
        var diff = moment.duration(now.diff(then))._data;
        if (parseInt(diff.days) == 1){
            this.props.deleteJob(12)
        }
        //
        // if (parseInt(diff.hours) > 12){
        //     this.props.deleteJob(this.props.id)
        // }

        if (diff.hours > 0){
            return diff.hours + " hours"
        }
        if (diff.minutes > 0) {
            return diff.minutes + " minutes"
        }
        return  diff.seconds + " second(s)";
    }

    getJobsLastUpdateInterval() {
        var now = moment();
        var jobsUpdate = moment(this.props.dateTime);
        var dataDiff = this.getDataDiff(now, jobsUpdate);

        if (_.isNull(this.state)) {
            this.setState({
                diff: dataDiff
            })
        }
        else {
            if (!_.isEqual(dataDiff, this.state.diff)) {
                this.setState({
                    diff: dataDiff
                })
            }
        }
    }

    componentWillUnmount() {
        clearInterval(this.interval)
    }

    componentDidMount() {
        this.interval = setInterval(this.getJobsLastUpdateInterval.bind(this), 4000);
    }

    componentWillMount() {
        this.getJobsLastUpdateInterval();
    }

    render() {
        return <td key={("rrr" + Math.random(100)).replace(".","jhgj")} className="gray">{this.state.diff} ago</td>
    }
}
module.exports = JobsAppearedTimeComponent;
