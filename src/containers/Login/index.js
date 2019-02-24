import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Button, Avatar, CssBaseline, FormControl, Input, InputLabel, Paper, Typography, withStyles } from "@material-ui/core";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import { loginUserAction, setUsernameOrEmailAction, setPasswordAction } from "../../actions/authActions";
import SignUpModal from "../../components/SignUpModal";

const styles = theme => ({
  main: {
    width: "auto",
    display: "block", // Fix IE 11 issue.
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
    position: "relative",
    top: "20%",
    [theme.breakpoints.up(400 + theme.spacing.unit * 3 * 2)]: {
      width: 400,
      marginLeft: "auto",
      marginRight: "15%"
    }
  },
  paper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme.spacing.unit * 3}px`
  },
  avatar: {
    margin: theme.spacing.unit,
    backgroundColor: theme.palette.secondary.main
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing.unit
  },
  submit: {
    marginTop: theme.spacing.unit * 3,
    background: "#fa9220"
  }
});

class Login extends Component {
  state = {
    modalOpen: false
  };

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
    const { errors, usernameOrEmail, password, classes } = this.props || {};
    const { modalOpen } = this.state || {};
    return (
      <div className="landing">
        <main className={classes.main}>
          <CssBaseline />
          <Paper className={classes.paper}>
            <Avatar className={classes.avatar}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign in
            </Typography>
            <form className={classes.form}>
              <FormControl margin="normal" required fullWidth>
                <InputLabel htmlFor="email">Email Address</InputLabel>
                <Input
                  id="email"
                  error={!!errors.usernameOrEmail}
                  name="email"
                  autoComplete="email"
                  autoFocus
                  onChange={this.onUsernameOrEmailChange}
                  value={usernameOrEmail}
                />
                {errors.usernameOrEmail && <div>{errors.usernameOrEmail}</div>}
              </FormControl>
              <FormControl margin="normal" required fullWidth>
                <InputLabel htmlFor="password">Password</InputLabel>
                <Input
                  error={!!errors.password}
                  value={password}
                  onChange={this.onPasswordChange}
                  name="password"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                />
                {errors.password && <div>{errors.password}</div>}
              </FormControl>
              {/* <FormControlLabel control={<Checkbox value="remember" color="primary" />} label="Remember me" /> */}
              <Button
                style={{ backgroundColor: "#ED8C0E" }}
                onClick={this.onSubmitClick}
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
              >
                Sign in
              </Button>
              <div className="text-center push--top">
                Don't have an acccount? <a onClick={() => this.setState({ modalOpen: true })}>Sign Up</a>
              </div>
            </form>
          </Paper>
        </main>
        <SignUpModal modalOpen={modalOpen} handleClose={() => this.setState({ modalOpen: false })} />
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
)(withStyles(styles)(Login));
