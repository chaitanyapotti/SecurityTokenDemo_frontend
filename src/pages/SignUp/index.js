import React from "react";
import Card from "@material-ui/core/Card";
import { withStyles } from "@material-ui/core/styles";
import Navbar from "../../containers/Navbar";
import SignUpForm from "../../components/SignUpForm";
import { Grid, Row, Col } from "../../helpers/react-flexbox-grid";

const styles = {
  card: {
    width: 500,
    padding: "50px",
    margin: "100px auto"
  }
};
const SignUp = props => {
  const { classes } = props || {};
  return (
    <div>
      <Navbar />
      <Grid>
        <Row>
          <Card className={classes.card}>
            <SignUpForm />
          </Card>
        </Row>
      </Grid>
    </div>
  );
};

export default withStyles(styles)(SignUp);
