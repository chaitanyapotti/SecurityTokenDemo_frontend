import React from "react";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import PropTypes from "../../PropTypes";

/**
 * @Component FormInputLabel
 *
 * @param props and their values
 * control --> Element
 * label --> string
 *
 * @returns { CUIFormInputLabel }
 *
 * @constructor MaterialUI FormControlLabel
 *
 * @Example
 *
 * <FormControlLabel control={<Checkbox onChange={this.handleChange('checkedA')} value="checkedA" />} label="Register Now" />
 *
 * @Material-FormControlLabel@API https://material-ui.com/api/form-control-label/#formcontrollabel
 */

const CUIFormInputLabel = props => {
  const { control, label } = props;
  return <FormControlLabel control={control} label={label} />;
};

CUIFormInputLabel.propTypes = {
  control: PropTypes.element.isRequired,
  label: PropTypes.node.isRequired
};
export default CUIFormInputLabel;
