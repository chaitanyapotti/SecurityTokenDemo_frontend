import React from "react";
import { CUIModal, CUIModalActions, CUIModalContent } from "../../../helpers/material-ui";
import LoadingButton from "../LoadingButton";

const AlertModal = props => {
  const { open, children, handleClose } = props || {};
  return (
    <div>
      <CUIModal open={open}>
        <CUIModalContent className="ModalContent">{children}</CUIModalContent>
        <br />
        <CUIModalActions className="ModalActions">
          <div className="hli">
            <LoadingButton onClick={handleClose}>Close</LoadingButton>
          </div>
        </CUIModalActions>
      </CUIModal>
    </div>
  );
};

export default AlertModal;
