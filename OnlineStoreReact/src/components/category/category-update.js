import React, { Component } from "react";
import { categoryDetail, updateCategory } from "../../actions/index"
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Field, reduxForm } from "redux-form";
import TextField from "material-ui/TextField";
import SelectField from "material-ui/SelectField";
import MenuItem from "material-ui/MenuItem";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import getMuiTheme from "material-ui/styles/getMuiTheme";
import PropTypes from "prop-types"

const validate = values => {
    const errors = {}
    const requiredFields = ['Name', 'Description']
    requiredFields.forEach(field => {
        if (!values[field]) {
            errors[field] = 'Required'
        }
    })
    return errors
}

const renderTextField = ({ input, label, type, defaultValue, name, id, meta: { touched, error }, ...custom }) => (

    <TextField hintText={label}
        floatingLabelText={label}
        className="text-field"
        defaultValue={defaultValue}
        type={type}
        id={id}
        onChange={(event) => input.onChange(event.target.value)}
        onBlur={(event) => input.onBlur(event.target.value)}
        errorText={touched && error}
        {...custom}
    />
)

class CategoryUpdateForm extends Component {


    state = {
        name: '',
        description: 0,
        done: false
    }

    componentWillMount() {
        this.setState({
            done: false
        });

        var categoryId = this.props.categoryId;
        if (categoryId == '0' && categoryId == undefined) {
            this.context.router.push("/admin/categories");

        }
        this.props.categoryDetail(categoryId);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.category != this.props.category) {
            this.setState({
                name: nextProps.category.Name,
                description: nextProps.category.Description,
                done: true
            });
        }
    }

    onSubmit(props) {
        this.props.updateCategory(props).then(() => {
            this.context.router.history.push("/admin/categories");
            this.context.router.history.replace("/admin/categories");
        });
    }

    render() {
        if (!this.state.done) {
            return (
                <div>Loading...</div>
            )
        }
        const { handleSubmit, pristine, reset, submitting } = this.props
        return (
            <div className="col-md-12 col-sm-12">
                <div className="page-header">
                    <h4 className="text-primary"> Update Category </h4>
                </div>
                <div className="container">
                    <MuiThemeProvider muiTheme={getMuiTheme()}>
                        <form onSubmit={handleSubmit(this.onSubmit.bind(this))}>
                            <div className="form-group">
                                <Field type="text" name="Name" id="Name" defaultValue={this.state.name} component={renderTextField} label="Category Name" />
                            </div>
                            <div>
                                <Field name="Description" defaultValue={this.state.description} component={renderTextField} label="Description" multiLine={true} rows={2} />
                            </div>
                            <div>
                                <button type="submit" className="btn btn-primary">Update</button>
                                <Link to="/admin/categories" className="btn btn-default">Go Back</Link>
                            </div>
                        </form>
                    </MuiThemeProvider>
                </div>
            </div>
        )
    }

}

// function mapStateToProps(state) {
//     return {
//         initialValues: state.categories.category
//     }
// }


function mapStateToProps(state) {
    return {
        category: state.categories.category,
        initialValues: state.categories.category
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        categoryDetail: categoryDetail,
        updateCategory: updateCategory
    }, dispatch);
}


export default connect(mapStateToProps, mapDispatchToProps)(reduxForm({
    form: 'CategoryUpdateForm',
    enableReinitialize: true,
    validate
})(CategoryUpdateForm));

CategoryUpdateForm.contextTypes = {
    router: PropTypes.object
}

// CategoryUpdateForm = reduxForm({
//     form: 'CategoryUpdateForm',
//     enableReinitialize: true,
//     validate
// })(CategoryUpdateForm)

// CategoryUpdateForm = connect(mapStateToProps, mapDispatchToProps)(CategoryUpdateForm)

// export default CategoryUpdateForm
