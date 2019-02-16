import React, { PureComponent } from "react";
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

class DropdownComponent extends PureComponent {
  render() {
    const { classes, data, label, value, onChange } = this.props || {};

    return (
      <form className={classes.root} autoComplete="off">
        <FormControl className={classes.formControl}>
          <InputLabel className="fnt-ps" style={{ fontSize: "14px" }} htmlFor="age-simple">
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
              <MenuItem className="fnt-ps" key={item.value} value={item.value} style={{ fontSize: "14px" }}>
                {item.text}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </form>
    );
  }
}

export default withStyles(selectInputStyle)(DropdownComponent);
