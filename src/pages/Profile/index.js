import React, { PureComponent } from "react";
import { connect } from "react-redux";
import { Grid } from "../../helpers/react-flexbox-grid";
import BioTable from "../../components/common/BioTable";
import Navbar from "../../containers/Navbar";

class Profile extends PureComponent {
  render() {
    const { first_name, email, phone, id, role, date, status } = this.props || {};
    return (
      <Grid container="true">
        <Navbar />
        <div style={{ marginTop: "100px" }}>
          <BioTable first_name={first_name} email={email} phone={phone} id={id} role={role} date={date} status={status} />
        </div>
      </Grid>
    );
  }
}

const mapStatesToProps = state => {
  const {
    userData: { first_name, email, phone, id, role, date, status }
  } = state.auth || {};
  return {
    first_name,
    email,
    phone,
    id,
    role,
    date,
    status
  };
};

export default connect(
  mapStatesToProps,
  {}
)(Profile);
