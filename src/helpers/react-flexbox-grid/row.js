import React from "react";
import { Row } from "react-flexbox-grid";
import PropTypes from "prop-types";

export const GridRow = props => {
  const { children, ...other } = props || {};
  return <Row {...other}>{children}</Row>;
};

GridRow.propTypes = {
  children: PropTypes.node.isRequired
};
