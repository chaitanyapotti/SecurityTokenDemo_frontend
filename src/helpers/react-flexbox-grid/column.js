import React from "react";
import { Col } from "react-flexbox-grid";
import PropTypes from "prop-types";

export const GridCol = props => {
  const { children, ...other } = props || {};
  return <Col {...other}>{children}</Col>;
};

GridCol.propTypes = {
  children: PropTypes.node.isRequired
};
