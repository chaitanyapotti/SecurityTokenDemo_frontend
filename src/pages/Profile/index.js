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
                <Col lg={3} sm={12} className="soft">
                  <div className="hl">
                    <div className="hli">
                      <AccountCircle style={{ fontSize: 60 }} />
                    </div>
                    <div className="hli push--left">
                      <div className="txt-l txt-dbld">
                        {first_name} {last_name}
                      </div>
                      <div className="push-half--top">{email}</div>
                      <div>{phone}</div>
                    </div>
                  </div>
                </Col>
                <Col lg={3} sm={12} className="soft">
                  <div>
                    <div className="txt-l txt-dbld">Account</div>
                    <div>{status}</div>
                    <div className="push--top txt-l txt-dbld">Active Since</div>
                    <div>{date.slice(0, 10)}</div>
                  </div>
                </Col>
                <Col lg={3} sm={12} className="soft">
                  <div>
                    <div className="txt-l txt-dbld">Pro Status</div>
                    <div>{this.getProStatus(role)}</div>
                    <div className="push--top txt-l txt-dbld">CRD Number</div>
                    <div>{id}</div>
                  </div>
                </Col>
                <Col lg={3} sm={12} className="soft">
                  <div>
                    <div className="push-half--top">
                      <a>
                        Connect with issuers <Lock />
                      </a>
                    </div>
                    <div className="push--top">
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
