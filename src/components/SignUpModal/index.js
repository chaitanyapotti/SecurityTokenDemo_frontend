import React from "react";
import { withStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";

import { CUIModal, CUIModalContent, CUIModalTitle } from "../../helpers/material-ui";
import SignUpForm from "../SignUpForm";

const DialogTitle = withStyles(theme => ({
  root: {
    borderBottom: `1px solid ${theme.palette.divider}`,
    margin: 0,
    padding: theme.spacing.unit * 2
  },
  closeButton: {
    position: "absolute",
    right: theme.spacing.unit,
    top: theme.spacing.unit,
    color: theme.palette.grey[500]
  }
}))(props => {
  const { children, classes, onClose } = props;
  return (
    <CUIModalTitle disableTypography className={classes.root}>
      <h6>{children}</h6>
      {onClose ? (
        <IconButton aria-label="Close" className={classes.closeButton} onClick={onClose}>
          <CloseIcon />
        </IconButton>
      ) : null}
    </CUIModalTitle>
  );
});

const SignUpModal = props => {
  const { modalOpen, handleClose } = props || {};
  return (
    <CUIModal width="500px" open={modalOpen}>
      <DialogTitle id="signup" onClose={handleClose}>
        SignUp Form
      </DialogTitle>
      <CUIModalContent>
        <SignUpForm />
      </CUIModalContent>
    </CUIModal>
  );
};

export default SignUpModal;
