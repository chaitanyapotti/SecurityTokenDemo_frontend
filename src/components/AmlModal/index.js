import React from "react";
import { withStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";

import { CUIModal, CUIModalContent, CUIModalTitle } from "../../helpers/material-ui";
import AmlForm from "../AmlForm";

const DialogTitle = withStyles(theme => ({
  root: {
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
    <CUIModalTitle className={classes.root}>
      <div>{children}</div>
      {onClose ? (
        <IconButton aria-label="Close" className={classes.closeButton} onClick={onClose}>
          <CloseIcon />
        </IconButton>
      ) : null}
    </CUIModalTitle>
  );
});

const AmlModal = props => {
  const { modalOpen, handleClose } = props || {};
  return (
    <CUIModal width="500px" open={modalOpen}>
      <DialogTitle id="signup" onClose={handleClose}>
        AML Compliance
      </DialogTitle>
      <CUIModalContent>
        <AmlForm />
      </CUIModalContent>
    </CUIModal>
  );
};

export default AmlModal;
