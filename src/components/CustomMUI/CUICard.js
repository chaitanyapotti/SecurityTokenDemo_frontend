import React from "react";
import { withStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";

const styles = {
  card: {
    minWidth: "275",
    padding: "40px 50px"
  },
  title: {
    fontSize: 14
  },
  pos: {
    marginBottom: 12
  }
};

const CustomCard = props => {
  const { children, classes } = props || {};
  const classNames = `card-brdr ${classes.card}`;
  return (
    <Card className={classNames} {...props}>
      {children}
    </Card>
  );
};

export default withStyles(styles)(CustomCard);
