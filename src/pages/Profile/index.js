import React, { PureComponent } from "react";
import { connect } from "react-redux";
import { AccountCircle, Lock } from "@material-ui/icons";
import { Paper } from "@material-ui/core";
import { Grid, Row, Col } from "../../helpers/react-flexbox-grid";
import Navbar from "../../containers/Navbar";

class Profile extends PureComponent {
  getProStatus = role => {
    return role === "INVESTOR" ? "Pro-Investor" : role === "BROKER_DEALER" ? "Broker Dealer" : "Market Maker";
  };

  render() {
    const { first_name, email, phone, id, role, date, status, last_name } = this.props || {};
    return (
      <Grid container="true">
        <Navbar />
        <div style={{ marginTop: "100px" }}>
          <Paper className="card-brdr push--ends">
            <Grid>
              <Row>
                <Col lg={3} sm={12}>
                  <div>
                    <AccountCircle style={{ fontSize: 100 }} />
                    <div>
                      {first_name} {last_name}
                    </div>
                    <div>{email}</div>
                    <div>{phone}</div>
                  </div>
                </Col>
                <Col lg={3} sm={12}>
                  <div>
                    <div>Account</div>
                    <div>{status}</div>
                    <div>Active Since</div>
                    <div>{date.slice(0, 10)}</div>
                  </div>
                </Col>
                <Col lg={3} sm={12}>
                  <div>
                    <div>Pro Status</div>
                    <div>{this.getProStatus(role)}</div>
                    <div>CRD Number</div>
                    <div>{id}</div>
                  </div>
                </Col>
                <Col lg={3} sm={12}>
                  <div>
                    <div>
                      <a>
                        Connect with issuers <Lock />
                      </a>
                    </div>
                    <div>
                      <a>
                        Connect with brokers <Lock />
                      </a>
                    </div>
                  </div>
                </Col>
              </Row>
            </Grid>
          </Paper>
        </div>
      </Grid>
    );
  }
}

const mapStatesToProps = state => {
  const {
    userData: { first_name, email, phone, id, role, date, status, last_name }
  } = state.auth || {};
  return {
    first_name,
    last_name,
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
