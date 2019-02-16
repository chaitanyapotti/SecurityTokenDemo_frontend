import React from "react";
import { CUIButton } from "../../../helpers/material-ui";

const ButtonComponent = props => {
  const { type, label, disabled, onClick, ...other } = props || {};
  return (
    <CUIButton
      className={
        type === "danger"
          ? "btn bg--danger txt-p-vault fnt-ps txt-dddbld text--white"
          : type === "pending"
          ? "btn bg--pending txt-p-vault fnt-ps txt-dddbld text--white"
          : "btn bg--primary txt-p-vault fnt-ps txt-dddbld text--white"
      }
      label={label}
      id={label}
      disabled={disabled}
      type={type || "contained"}
      // labelStyle={{ padding: "6px 16px" }}
      onClick={() => {
        onClick();
      }}
      {...other}
    />
  );
};

export default ButtonComponent;
