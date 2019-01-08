import React, { Component } from "react";
import { Button, Form, Header, Segment } from "semantic-ui-react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Grid, Row, Col } from "../../helpers/react-flexbox-grid";
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
        <div className="landing">
          <Grid>
            <Row>
              <Col>
                <img src="/assets/TWO12BlkWht.png" style={{ width: "300px", height: "78px", marginTop: "20px" }} alt="Logo" />
              </Col>
            </Row>
            <Row end="lg" middle="lg" start="lg">
              <Col lg={6}>
                <div className="text-shadow-medium text-white txt-m bold txt-xxxxl">
                  FINANCING <br /> THE FUTURE
                </div>
              </Col>
              <Col lg={6}>
                <Form size="large" style={{ marginTop: "50%", marginLeft: "20%" }}>
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
                    {errors.usernameOrEmail && <Form.Field>{errors.usernameOrEmail}</Form.Field>}
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
                    {errors.password && <Form.Field>{errors.password}</Form.Field>}
                    <Button onClick={this.onSubmitClick} className="btn bg-test txt-p-vault txt-dddbld text--white" fluid size="large">
                      Login
                    </Button>
                  </Segment>
                </Form>
              </Col>
            </Row>
          </Grid>
        </div>
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
