import React, { PureComponent } from "react";
import { withStyles, CssBaseline, Paper, Typography, Avatar, Card } from "@material-ui/core";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import SignUpForm from "../../components/SignUpForm";
// import { Grid, Row, Col } from "../../helpers/react-flexbox-grid";
import { getURLParameter } from "../../helpers/numberHelpers";

export const styles = theme => ({
  main: {
    width: "600px",
    display: "block", // Fix IE 11 issue.
    margin: "0 50%",
    position: "relative",
    top: "4%"
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
  card: {
    width: "500px",
    padding: "50px"
  }
});

class SignUp extends PureComponent {
  componentDidMount() {
    const token = getURLParameter("token") || {};
    // show user
    if (!token) console.log("error");
  }

  render() {
    const { classes, history, location, match } = this.props || {};
    console.log("props in signiup", this.props);
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
            <Card className={classes.card}>
              <SignUpForm history={history} location={location} match={match} />
            </Card>
          </Paper>
        </main>
      </div>
    );
  }
}

export default withStyles(styles)(SignUp);
