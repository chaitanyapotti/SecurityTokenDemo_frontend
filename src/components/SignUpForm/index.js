import React, { PureComponent } from "react";
import { Field, reduxForm } from "redux-form";
import axios from "axios";
import { Button } from "@material-ui/core";
import { TextField } from "../common/FormComponents";
import actionTypes from "../../actionTypes";
import config from "../../config";

// import { signUp } from "../../actions/signUpActions";
import { getURLParameter } from "../../helpers/numberHelpers";
import CustomizedSnackbars from "../common/Snackbar";

const validate = values => {
  const errors = {};
  const requiredFields = ["firstName", "lastName", "email", "userName", "password", "contact", "pubadd"];
  requiredFields.forEach(field => {
    if (!values[field]) {
      errors[field] = "Required";
    }
  });
  if (values.email && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
    errors.email = "Invalid email address";
  }
  return errors;
};

class SignUpForm extends PureComponent {
  state = {
    snackbar: false,
    signUpError: ""
  };

  openSnackBar = err => this.setState({ snackbar: true, signUpError: err });

  closeSnackBar = () => this.setState({ snackbar: false });

  onSubmit = (values, dispatch, props) => {
    const token = getURLParameter("token") || {};
    const authorization = `Bearer ${token}`;
    axios
      .post(
        `${config.api}/api/users/register`,
        {
          firstName: values.firstName,
          lastName: values.lastName,
          username: values.username,
          email: values.email,
          password: values.password,
          publicAddress: values.pubadd,
          phone: values.contact
        },
        {
          headers: {
            Authorization: authorization
          }
        }
      )
      .then(res => {
        console.log(res);
        dispatch({
          type: actionTypes.SIGN_UP_SUCCESS,
          payload: {}
        });
      })
      .catch(err => {
        console.log(err);
        this.openSnackBar(err);
        // dispatch({
        //   type: actionTypes.SIGN_UP_ERROR,
        //   payload: err.response.data
        // });
      });
    // dispatch(signUp(values, token));
  };

  render() {
    const { handleSubmit, pristine, reset, submitting } = this.props || {};
    const { snackbar, signUpError } = this.state || {};
    return (
      <div>
        <form onSubmit={this.onSubmit}>
          <div>
            <Field name="firstName" component={TextField} label="First Name" />
          </div>
          <div className="push--top">
            <Field name="lastName" component={TextField} label="Last Name" />
          </div>
          <div className="push--top">
            <Field name="username" component={TextField} label="User Name" />
          </div>
          <div className="push--top">
            <Field name="email" component={TextField} label="Email" />
          </div>
          <div className="push--top">
            <Field name="password" type="password" component={TextField} label="Password" />
          </div>
          <div className="push--top">
            <Field name="pubadd" component={TextField} label="Public Address" />
          </div>
          <div className="push--top">
            <Field name="contact" component={TextField} label="Contact Number" />
          </div>
          <div className="push--top">
            <Button className="btn bg--primary txt-p-vault txt-dddbld text--white" type="submit" disabled={pristine || submitting}>
              Submit
            </Button>
            <Button
              className="btn bg--primary txt-p-vault txt-dddbld text--white push--left"
              type="button"
              disabled={pristine || submitting}
              onClick={reset}
            >
              Clear Values
            </Button>
          </div>
        </form>
        <CustomizedSnackbars open={snackbar} error={signUpError} closeSnackBar={this.closeSnackBar} />
      </div>
    );
  }
}

export default reduxForm({
  // a unique name for the form
  form: "signUp",
  validate
})(SignUpForm);
