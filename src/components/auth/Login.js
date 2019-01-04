import React, { Component } from "react";
import { Header, Button } from "semantic-ui-react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
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
    console.log("test");
    if (isAuthenticated) {
      console.log("yes");
      history.push("/dashboard");
    }
  }

  componentDidUpdate(prevProps) {
    const { isAuthenticated, history } = this.props || {};
    const { isAuthenticated: oldAuthentication } = prevProps || {};
    console.log("yess");
    if (oldAuthentication !== isAuthenticated && isAuthenticated) {
      console.log("no");
      history.push("/dashboard");
    }
  }

  render() {
    const { errors, usernameOrEmail, password } = this.props || {};
    return (
      <div>
        <Header size="huge">es</Header>
        <Button size="massive">check</Button>
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
