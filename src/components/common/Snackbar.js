import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { CheckCircle, Error, Close, Info, Warning } from "@material-ui/icons";
import { green, amber } from "@material-ui/core/colors";
import { withStyles, IconButton, Snackbar, SnackbarContent } from "@material-ui/core";

const variantIcon = {
  success: CheckCircle,
  warning: Warning,
  error: Error,
  info: Info
};

const styles1 = theme => ({
  success: {
    backgroundColor: green[600]
  },
  error: {
    backgroundColor: theme.palette.error.dark
  },
  info: {
    backgroundColor: theme.palette.primary.dark
  },
  warning: {
    backgroundColor: amber[700]
  },
  icon: {
    fontSize: 20
  },
  iconVariant: {
    opacity: 0.9,
    marginRight: theme.spacing.unit
  },
  message: {
    display: "flex",
    alignItems: "center"
  }
});

function MySnackbarContent(props) {
  const { classes, className, message, onClose, variant, ...other } = props || {};
  const Icon = variantIcon[variant];

  return (
    <SnackbarContent
      className={classNames(classes[variant], className)}
      aria-describedby="client-snackbar"
      message={
        <span id="client-snackbar" className={classes.message}>
          <Icon className={classNames(classes.icon, classes.iconVariant)} />
          {message}
        </span>
      }
      action={[
        <IconButton key="close" aria-label="Close" color="inherit" className={classes.close} onClick={onClose}>
          <Close className={classes.icon} />
        </IconButton>
      ]}
      {...other}
    />
  );
}

MySnackbarContent.propTypes = {
  variant: PropTypes.oneOf(["success", "warning", "error", "info"]).isRequired
};

const MySnackbarContentWrapper = withStyles(styles1)(MySnackbarContent);

class CustomizedSnackbars extends React.Component {
  render() {
    const { open, error, closeSnackBar } = this.props || {};

    return (
      <div>
        <Snackbar
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left"
          }}
          open={open}
          autoHideDuration={6000}
          onClose={this.handleClose}
        >
          <MySnackbarContentWrapper onClose={closeSnackBar} variant="error" message={error} />
        </Snackbar>
      </div>
    );
  }
}

export default CustomizedSnackbars;
