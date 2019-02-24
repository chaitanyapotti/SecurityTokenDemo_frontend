import React from "react";
import { Field, reduxForm } from "redux-form";
import TextField from "@material-ui/core/TextField";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import FormHelperText from "@material-ui/core/FormHelperText";
import Button from "@material-ui/core/Button";

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

const renderTextField = ({ label, input, meta: { touched, invalid, error }, ...custom }) => (
  <TextField label={label} placeholder={label} fullWidth error={touched && invalid} helperText={touched && error} {...input} {...custom} />
);

const renderFromHelper = ({ touched, error }) => {
  if (!(touched && error)) {
  } else {
    return <FormHelperText>{touched && error}</FormHelperText>;
  }
};

const renderSelectField = ({ input, label, meta: { touched, error }, children, ...custom }) => (
  <FormControl fullWidth error={touched && error}>
    <InputLabel htmlFor="role">Role</InputLabel>
    <Select
      native
      {...input}
      {...custom}
      inputProps={{
        name: "Role",
        id: "role"
      }}
    >
      {children}
    </Select>
    {renderFromHelper({ touched, error })}
  </FormControl>
);

const SignUpForm = props => {
  const { handleSubmit, pristine, reset, submitting, classes } = props;
  return (
    <form onSubmit={handleSubmit}>
      <div>
        <Field name="firstName" component={renderTextField} label="First Name" />
      </div>
      <div style={{ marginTop: "20px" }}>
        <Field name="lastName" component={renderTextField} label="Last Name" />
      </div>
      <div style={{ marginTop: "20px" }}>
        <Field name="username" component={renderTextField} label="User Name" />
      </div>
      <div style={{ marginTop: "20px" }}>
        <Field name="email" component={renderTextField} label="Email" />
      </div>
      <div style={{ marginTop: "20px" }}>
        <Field name="password" component={renderTextField} label="Password" />
      </div>
      <div style={{ marginTop: "20px" }}>
        <Field classes={classes} name="favoriteColor" component={renderSelectField} label="Favorite Color">
          <option value="" />
          <option value="BROKER_DEALER">Broker Dealer</option>
          <option value="MARKET_MAKER">Market Maker</option>
          <option value="INVESTOR">Investor</option>
        </Field>
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

export default reduxForm({
  // a unique name for the form
  form: "signUp",
  validate
})(SignUpForm);
