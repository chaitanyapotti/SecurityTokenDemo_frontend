import React, { PureComponent } from "react";
import { Field, reduxForm, SubmissionError } from "redux-form";
import axios from "axios";
import { Button } from "@material-ui/core";
import { TextField } from "../common/FormComponents";
import config from "../../config";
import web3 from "../../helpers/web3";

import { getURLParameter } from "../../helpers/numberHelpers";

const validate = values => {
  const errors = {};
  const requiredFields = ["firstName", "lastName", "email", "username", "password", "contact", "pubadd"];
  requiredFields.forEach(field => {
    if (!values[field]) {
      errors[field] = "Required";
    }
  });
  if (values.password && (values.password.length > 15 || values.password.length < 5))
    errors.password = "Invalid password. Must be between 5 and 15 characters";
  if (values.username && (values.username.length > 10 || values.username.length < 3))
    errors.username = "Invalid username. Must be between 3 and 10 characters";
  if (values.pubadd && !web3.utils.isAddress(values.pubadd)) errors.pubadd = "Invalid Public Address";
  if (values.email && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
    errors.email = "Invalid email address";
  }
  return errors;
};

class SignUpForm extends PureComponent {
  render() {
    const { pristine, reset, submitting, handleSubmit, error } = this.props || {};
    return (
      <div>
        <form onSubmit={handleSubmit(onSubmit)}>
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
          {error && <strong>{error}</strong>}
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
      </div>
    );
  }
}

const onSubmit = (values, dispatch, props) => {
  const token = getURLParameter("token") || {};
  const { history } = props || {};
  const authorization = `Bearer ${token}`;
  return axios
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
      history.push("/");
    })
    .catch(err => {
      console.log(err);
      throw new SubmissionError({ _error: `Sign up failed! Please check your inputs. ${err.message}` });
    });
};

export default reduxForm({
  // a unique name for the form
  form: "signUp",
  validate
})(SignUpForm);
