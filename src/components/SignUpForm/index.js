import React from "react";
import { Field, reduxForm } from "redux-form";
import { Button } from "@material-ui/core";
import { TextField } from "../common/FormComponents";
import { signUp } from "../../actions/signUpActions";
import { getURLParameter } from "../../helpers/numberHelpers";

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

const SignUpForm = props => {
  const { handleSubmit, pristine, reset, submitting } = props || {};
  return (
    <form onSubmit={handleSubmit}>
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
  );
};

const onSubmit = (values, dispatch, props) => {
  const token = getURLParameter("token") || {};
  dispatch(signUp(values, token));
};

export default reduxForm({
  // a unique name for the form
  form: "signUp",
  validate,
  onSubmit
})(SignUpForm);
