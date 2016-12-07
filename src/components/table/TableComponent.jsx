import JobsAppearedTimeComponent from 'components/table/JobsAppearedTimeComponent.jsx'
import DropDownComponent from 'components/dropdown/DropdownComponert.jsx'
import UUID from 'uuid-js'

class TableComponent extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            tableHeader: {
                "firm": "Firm Name",
                "location": "Location",
                "title": "Job Title",
                "scraped": "Update Date/Time"
            },
            jobsPerPage: 10,
            page: 0,

        };
    }

    updateLimit(limit) {
        if (!_.isEqual(this.state.jobsPerPage, limit)) {
            this.setState({jobsPerPage: limit})
        }

        if (limit > this.props.data.length && this.state.page != 0) {
            this.setState({page: 0})
        }
    }

    updatePageNumber(page) {
        if (!_.isEqual(this.state.page, page)) {
            var maxPage = Math.floor(this.props.data.length / this.state.jobsPerPage);
            var pageNumber = parseInt(page) > 0 ? page : 0;
            var pageNumber = pageNumber < maxPage ? pageNumber : maxPage;
            this.setState({page: pageNumber})
        }
    }

    moveToNextPrevPage(page) {
        this.updatePageNumber(this.state.page + page)
    }

    generateId() {
        var uuid4 = UUID.create();
        return uuid4.toString();
    }

    getTableHead() {
        var self = this;
        var header = Object.keys(this.state.tableHeader).map(function (key) {
            return <th key={self.generateId()}>{self.state.tableHeader[key]}</th>;
        });
        return (
            <thead>
            <tr>{header}</tr>
            </thead>
        );
    }

    deleteJob(id) {
        this.props.deleteJob(id)
    }

    getTableBody(dataArray) {
        var self = this;
        var jobsPerPage = parseInt(this.state.jobsPerPage);
        var currentPage = parseInt(this.state.page);
        var slicedData = dataArray.slice(currentPage * jobsPerPage, currentPage * jobsPerPage + jobsPerPage);
        var tbody = slicedData.map(function (data, index) {
            var row = Object.keys(self.state.tableHeader).map(function (columnName, row_index) {
                if (!_.isEqual(columnName, 'url')) {
                    if (_.isEqual(columnName, 'scraped')) {
                        return <JobsAppearedTimeComponent
                            dateTime={data[columnName]}
                            index={index}
                            key={self.generateId()}
                            id={data['id']}
                            deleteJob={self.deleteJob.bind(self)}
                        />
                    }
                    if (_.isEqual(columnName, "title")) {
                        return <td key={self.generateId()} id={index + row_index}>
                            <a target="_blank" href={data['url']}>{data[columnName]}</a>
                        </td>
                    }
                    return <td key={self.generateId()} id={index + row_index}>{data[columnName]}</td>
                }
            });
            return <tr key={self.generateId()} id={index}>{row}</tr>
        });
        return <tbody>{tbody}</tbody>
    }

    getTableFoot(dataArray) {
        return (
            <tfoot>
            <tr key="footer">
                <th colSpan="5">
                    <div className="ui right aligned grid">
                        <div className="left floated left aligned column">
                            <div className="page-items dropdown">
                                <DropDownComponent
                                    fields={[10, 20, 50, 100, 200]}
                                    updateLimit={(itemsLimit) => this.updateLimit(itemsLimit)}
                                    immediatelyChange={true}
                                    id="jobsPerPage"
                                    dropdownTitle={this.state.jobsPerPage}
                                />
                            </div>
                        </div>
                        <div className="right floated left aligned  column">
                            <div className="ui right floated pagination menu column">
                                <a className="icon item" onClick={this.updatePageNumber.bind(this, 0)}>
                                    <i className="step backward chevron icon"></i>
                                </a>
                                <a className="icon item" onClick={this.moveToNextPrevPage.bind(this, -1)}>
                                    <i className="caret left chevron icon"></i>
                                </a>
                                <div className="ui big basic label">
                                    {parseInt(this.state.page) + 1}
                                </div>
                                <a className="icon item" onClick={this.moveToNextPrevPage.bind(this, 1)}>
                                    <i className="caret right chevron icon"></i>
                                </a>
                                <a className="icon item"
                                   onClick={this.updatePageNumber.bind(this, Math.floor(dataArray.length / this.state.jobsPerPage))}>
                                    <i className="step forward chevron icon"></i>
                                </a>
                            </div>
                        </div>
                    </div>
                </th>
            </tr>
            </tfoot>

        )
    }

    render() {
        var tbody = this.getTableBody(this.props.data);
        var thead = this.getTableHead();
        var tfoot = this.getTableFoot(this.props.data);
        return (
            <table className="ui striped celled selectable unstackable table" id="jobs">
                {thead}
                {tbody}
                {tfoot}
            </table>
        )
    }
}


module.exports = TableComponent;

