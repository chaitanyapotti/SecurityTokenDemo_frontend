import React, { Component } from "react";
import {
  Button,
  Avatar,
  CssBaseline,
  FormControl,
  FormControlLabel,
  Checkbox,
  Input,
  InputLabel,
  Paper,
  Typography,
  withStyles
} from "@material-ui/core";
import { CUIModal, CUIModalActions, CUIModalContent } from "../../helpers/material-ui";

class AddInvestorModal extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { modalOpen, close, errors, password = "" } = this.props || {};
    return (
      <div>
        <CUIModal open={modalOpen}>
          <CUIModalContent>
            <FormControl margin="normal" required fullWidth>
              <InputLabel htmlFor="first">First Name</InputLabel>
              <Input value={password} onChange={this.onPasswordChange} name="first" type="first" id="first" />
              {/* {errors.password && <div>{errors.password}</div>} */}
            </FormControl>
            <FormControl margin="normal" required fullWidth>
              <InputLabel htmlFor="last">Last Name</InputLabel>
              <Input value={password} onChange={this.onPasswordChange} name="last" type="last" id="last" />
              {/* {errors.password && <div>{errors.password}</div>} */}
            </FormControl>
            <FormControl margin="normal" required fullWidth>
              <InputLabel htmlFor="email">Email</InputLabel>
              <Input value={password} onChange={this.onPasswordChange} name="email" type="email" id="email" />
              {/* {errors.password && <div>{errors.password}</div>} */}
            </FormControl>
            <FormControl margin="normal" required fullWidth>
              <InputLabel htmlFor="password">Password</InputLabel>
              <Input value={password} onChange={this.onPasswordChange} name="password" type="password" id="password" />
              {/* {errors.password && <div>{errors.password}</div>} */}
            </FormControl>
          </CUIModalContent>
          <CUIModalActions>
            <Button variant="contained" color="primary">
              Submit
            </Button>
            <Button onClick={() => close()} variant="contained" color="primary">
              Cancel
            </Button>
          </CUIModalActions>
        </CUIModal>
      </div>
    );
  }
}

export default AddInvestorModal;
