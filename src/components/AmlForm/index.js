import React from "react";
import { Field, reduxForm } from "redux-form";
import { Button } from "@material-ui/core";
import { amlComplyCheck } from "../../actions/amlActions";
import { TextField, Picker } from "../common/FormComponents";

const validate = values => {
  const errors = {};
  const requiredFields = ["firstName", "lastName", "dob"];
  requiredFields.forEach(field => {
    if (!values[field]) {
      errors[field] = "Required";
    }
  });
  console.log(values.dob);
  if (
    values.dob &&
    (!Date.parse(values.dob) ||
      (new Date(Date.parse(values.dob)) >= new Date("01/01/2001") || new Date(Date.parse(values.dob)) <= new Date("01/01/1919")))
  ) {
    errors.dob = "Invalid Date";
  }
  return errors;
};

const AmlForm = props => {
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
        <Field name="dob" component={Picker} label="Date of Birth" />
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

const onSubmit = (values, dispatch) => {
  dispatch(amlComplyCheck(values));
};

export default reduxForm({
  // a unique name for the form
  form: "aml",
  validate,
  onSubmit
})(AmlForm);
