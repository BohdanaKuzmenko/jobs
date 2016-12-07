import UUID from 'uuid-js'

class DropDownComponent extends React.Component {

    constructor(props) {
        super(props);
        this.state = {value: ""}
    }

    handleChange(e) {
        this.props.updateLimit(e)
    }

    componentDidMount() {
        var self = this;
        $("#" + this.props.id).dropdown({
            onHide: function () {
                if (self.props.multiple){
                    var selectedValues = $("#" + self.props.id).dropdown('get value');
                    if (selectedValues != null) {
                        self.props.onKeysChange(selectedValues)
                    }
                }
            },

            onRemove: function (removedValue) {
                if (self.props.multiple){
                    // if ($("#" + self.props.id).dropdown('is hidden')[0]) {
                        var selectedValues = $("#" + self.props.id).dropdown('get value');
                        var afterRemoveResult = selectedValues.split(',').filter(function (value) {
                            return (value != removedValue);
                        });
                        self.props.onKeysChange(afterRemoveResult.map(function (value) {
                            return value
                        }).join(','));
                    // }
                }
            }
        });

        if (!_.isEmpty(this.props.defaultValue)){
            $("#" + self.props.id).dropdown('set selected', this.props.defaultValue.split(","));
        }

        if (this.props.immediatelyChange){
            $("#" + self.props.id).dropdown({
                onChange: function (e) {
                    self.handleChange(e)
                },
            });
        }
    }


    render() {
        var fields = this.props.fields.map(function (key) {
            return <div className="item" key={key} data-value={key}>{key}</div>
        });

        var dropdownClass = "ui search dropdown selection";

        if (this.props.multiple){
            dropdownClass += " multiple"
        }

        if (this.props.fluid){
            dropdownClass += " fluid"
        }

        var title = (_.isEmpty(this.props.dropdownTitle.toString()))?"":<div className="default text">{this.props.dropdownTitle}</div>
        return (
            <div className="field">
                <div className={dropdownClass} id = {this.props.id} >
                    <input  name="pages" onChange={this.handleChange.bind(this)}/>
                    {title}
                        <i className="dropdown icon"></i>
                        <div className="menu">
                            {fields}
                        </div>
                </div>
            </div>
        )
    }
}

module.exports = DropDownComponent;

