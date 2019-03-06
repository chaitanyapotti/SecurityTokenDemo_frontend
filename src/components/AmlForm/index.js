import React from "react";
import { Field, reduxForm } from "redux-form";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { amlComplyCheck } from "../../actions/amlActions";

const validate = values => {
  const errors = {};
  const requiredFields = ["firstName", "lastName", "email", "favoriteColor", "notes"];
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

const renderTextField = props => {
  const {
    label,
    input,
    meta: { touched, invalid, error },
    ...custom
  } = props || {};
  return <TextField label={label} placeholder={label} fullWidth error={touched && invalid} helperText={touched && error} {...input} {...custom} />;
};

const renderPicker = props => {
  const {
    label,
    input,
    meta: { touched, invalid, error },
    ...custom
  } = props || {};
  return (
    <TextField
      type="date"
      label={label}
      placeholder={label}
      fullWidth
      error={touched && invalid}
      helperText={touched && error}
      InputLabelProps={{
        shrink: true
      }}
      {...input}
      {...custom}
    />
  );
};

const AmlForm = props => {
  const { handleSubmit, pristine, reset, submitting } = props || {};
  return (
    <form onSubmit={handleSubmit}>
      <div>
        <Field name="firstName" component={renderTextField} label="First Name" />
      </div>
      <div style={{ marginTop: "20px" }}>
        <Field name="lastName" component={renderTextField} label="Last Name" />
      </div>
      <div style={{ marginTop: "20px" }}>
        <Field name="dob" component={renderPicker} label="Date of Birth" />
      </div>
      <div style={{ marginTop: "20px" }}>
        <Button className="btn bg--primary txt-p-vault txt-dddbld text--white" type="submit" disabled={pristine || submitting}>
          Submit
        </Button>
        <Button
          style={{ marginLeft: "20px" }}
          className="btn bg--primary txt-p-vault txt-dddbld text--white"
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
