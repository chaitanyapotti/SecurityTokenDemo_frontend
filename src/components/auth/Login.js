import React, { Component } from "react";
import AppBar from "@material-ui/core/AppBar";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import { loginUserAction, setUsernameOrEmailAction, setPasswordAction } from "../../actions/authActions";

class Login extends Component {
  onUsernameOrEmailChange = e => {
    const { setUsernameOrEmailAction: setUsernameOrEmail } = this.props;
    setUsernameOrEmail(e.target.value);
  };

  onPasswordChange = e => {
    const { setPasswordAction: setPassword } = this.props;
    setPassword(e.target.value);
  };

  onSubmitClick = e => {
    e.preventDefault();
    const { loginUserAction: loginUser } = this.props;
    const { usernameOrEmail, password } = this.props || {};
    const userData = {
      usernameOrEmail,
      password
    };

    loginUser(userData);
  };

  componentDidMount() {
    const { isAuthenticated, history } = this.props || {};
    if (isAuthenticated) {
      history.push("/dashboard");
    }
  }

  componentDidUpdate(prevProps) {
    const { isAuthenticated, history } = this.props || {};
    const { isAuthenticated: oldAuthentication } = prevProps || {};
    if (oldAuthentication !== isAuthenticated && isAuthenticated) {
      history.push("/dashboard");
    }
  }

  render() {
    const { errors, usernameOrEmail, password } = this.props || {};

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
