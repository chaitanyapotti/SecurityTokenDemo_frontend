import React from "react";
import { withStyles } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";

const selectInputStyle = {
  formControl: {
    paddingBottom: "10px",
    margin: "30px 0 0 0",
    position: "relative",
    width: "100%"
  },
  root: {
    display: "flex",
    flexWrap: "wrap"
  },
  font: {
    fontSize: "14px"
  }
};

const CUISelectInput = props => {
  const { classes, data, label, value, onChange } = props || {};
  return (
    <form className={classes.root} autoComplete="off">
      <FormControl className={classes.formControl}>
        <InputLabel style={{ fontSize: "14px" }} htmlFor="age-simple">
          {label}
        </InputLabel>
        <Select
          value={value}
          onChange={onChange}
          inputProps={{
            id: { label }
          }}
          style={{ fontSize: "14px" }}
        >
          {data.map((item, index) => (
            <MenuItem key={item.value} value={item.value} style={{ fontSize: "14px" }}>
              {item.value}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </form>
  );
};

export default withStyles(selectInputStyle)(CUISelectInput);
