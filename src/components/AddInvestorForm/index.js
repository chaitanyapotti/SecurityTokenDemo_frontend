import React from "react";
import { Field, reduxForm } from "redux-form";
import { Button } from "@material-ui/core";
import { TextField } from "../common/FormComponents";

const validate = values => {
  const errors = {};
  const requiredFields = ["firstName", "lastName", "email"];
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

const AddInvestorForm = props => {
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
        <Field name="email" component={TextField} label="Email" />
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

export default reduxForm({
  // a unique name for the form
  form: "addInvestor",
  validate
})(AddInvestorForm);
