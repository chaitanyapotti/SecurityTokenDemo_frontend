import React, { Component } from "react";
import { Button, Form, Grid, Header, Segment } from "semantic-ui-react";
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
    const { loginUserAction: loginUser } = this.props;
    const { usernameOrEmail, password, history } = this.props || {};
    const userData = {
      usernameOrEmail,
      password
    };

    loginUser(userData, history);
  };

  componentDidMount() {
    const { isAuthenticated, history } = this.props || {};

    if (isAuthenticated) {
      history.push("/dashboard");
    }
  }

  render() {
    const { errors, usernameOrEmail, password } = this.props || {};
    return (
      <div className="login-form">
        <style>
          {`
      body > div,
      body > div > div,
      body > div > div > div.login-form {
        height: 100%;
      }
    `}
        </style>
        <Grid textAlign="center" style={{ height: "100%" }} verticalAlign="middle">
          <Grid.Column style={{ maxWidth: 450 }}>
            <Header as="h2" color="teal" textAlign="center">
              Log-in to your account
            </Header>
            <Form size="large">
              <Segment stacked>
                <Form.Input
                  error={!!errors.usernameOrEmail}
                  value={usernameOrEmail}
                  onChange={this.onUsernameOrEmailChange}
                  fluid
                  icon="user"
                  iconPosition="left"
                  placeholder="Username or E-mail address"
                />
                <Form.Field>{errors.usernameOrEmail}</Form.Field>
                <Form.Input
                  error={!!errors.password}
                  value={password}
                  onChange={this.onPasswordChange}
                  fluid
                  icon="lock"
                  iconPosition="left"
                  placeholder="Password"
                  type="password"
                />
                <Form.Field>{errors.password}</Form.Field>
                <Button onClick={this.onSubmitClick} color="teal" fluid size="large">
                  Login
                </Button>
              </Segment>
            </Form>
          </Grid.Column>
        </Grid>
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
