import React, { Component } from "react";
import AppBar from "@material-ui/core/AppBar";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { loginUserAction, setUsernameOrEmailAction, setPasswordAction } from "../../actions/authActions";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";

class Login extends Component {
  onUsernameOrEmailChange = e => {
    const { setUsernameOrEmailAction } = this.props;
    setUsernameOrEmailAction(e.target.value);
  };
  onPasswordChange = e => {
    const { setPasswordAction } = this.props;
    setPasswordAction(e.target.value);
  };
  onSubmitClick = e => {
    e.preventDefault();
    const { loginUserAction, usernameOrEmail, password } = this.props;
    const userData = {
      usernameOrEmail: usernameOrEmail,
      password: password
    };

    loginUserAction(userData);
  };

  componentDidMount() {
    const { isAuthenticated } = this.props;
    if (isAuthenticated) {
      this.props.history.push("/dashboard");
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.isAuthenticated) {
      this.props.history.push("/dashboard");
    }
  }
  render() {
    const { errors, usernameOrEmail, password } = this.props;

    return (
      <div>
        <AppBar color="primary" position="static">
          <Toolbar>
            <Typography variant="h6" color="inherit">
              Login
            </Typography>
          </Toolbar>
        </AppBar>
        {errors.usernameOrEmail ? (
          <TextField error label="Username or Email" margin="normal" value={usernameOrEmail} onChange={this.onUsernameOrEmailChange} />
        ) : (
          <TextField label="Username or Email" margin="normal" value={usernameOrEmail} onChange={this.onUsernameOrEmailChange} />
        )}

        <br />
        {errors.usernameOrEmail && <div>{errors.usernameOrEmail}</div>}
        {errors.password ? (
          <TextField error label="Enter your Password" margin="normal" value={password} onChange={this.onPasswordChange} />
        ) : (
          <TextField label="Enter your Password" margin="normal" value={password} onChange={this.onPasswordChange} />
        )}

        <br />
        {errors.password && <div>{errors.password}</div>}
        <br />
        <Button variant="contained" onClick={this.onSubmitClick}>
          Submit
        </Button>
      </div>
    );
  }
}

const mapStateToProps = state => {
  const { isAuthenticated, user, usernameOrEmail, password } = state.auth || {};
  const { errors } = state || {};

  return {
    isAuthenticated,
    user,
    usernameOrEmail,
    password,
    errors
  };
};

Login.propTypes = {
  loginUserAction: PropTypes.func.isRequired,
  setPasswordAction: PropTypes.func.isRequired,
  setUsernameOrEmailAction: PropTypes.func.isRequired
};

export default connect(
  mapStateToProps,
  { loginUserAction, setPasswordAction, setUsernameOrEmailAction }
)(Login);
