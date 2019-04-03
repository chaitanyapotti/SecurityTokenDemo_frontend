import React from "react";
import { TextField } from "@material-ui/core";

const Picker = props => {
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

export default Picker;
