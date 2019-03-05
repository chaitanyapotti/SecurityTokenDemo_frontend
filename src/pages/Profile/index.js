import React, { PureComponent } from "react";
import { Grid, Row, Col } from "../../helpers/react-flexbox-grid";
import BioTable from "../../components/common/BioTable";
import Navbar from "../../containers/Navbar";

class Profile extends PureComponent {
  componentWillMount() {
    const { publicAddress, first_name, email, phone, id, role, date, status } = JSON.parse(localStorage.getItem("user_data")) || {};
    this.setState({ first_name, email, phone, id, role, date, status, publicAddress });
  }

  render() {
    const { first_name, email, phone, id, role, date, status, publicAddress } = this.state;
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

export default Profile;
