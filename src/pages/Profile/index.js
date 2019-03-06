import React, { PureComponent } from "react";
import { connect } from "react-redux";
import { AccountCircle, Lock } from "@material-ui/icons";
import { Paper, Table, TableBody, TableCell, TableHead, TableRow } from "@material-ui/core";
import { Grid, Row, Col } from "../../helpers/react-flexbox-grid";
import Navbar from "../../containers/Navbar";
import constants from "../../helpers/constants";

class Profile extends PureComponent {
  getProStatus = role => (role === constants.MARKET_MAKER ? "Market Maker" : role === constants.BROKER_DEALER ? "Broker Dealer" : "Pro-Investor");

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
          <Paper className="card-brdr push--ends soft">
            <div>Hello, {first_name}!</div>
            <div className="push--top">
              {/* Check for final kyc/aml/accreditation status and enable or disable below content */}
              You still need to do some checks
            </div>
          </Paper>
          <Paper className="card-brdr push--ends">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell className="txt-s fnt-ps txt-dddbld table-head-clr">Check Type</TableCell>
                  <TableCell className="txt-s fnt-ps txt-dddbld table-head-clr">Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell className="txt-s fnt-ps table-text-pad">KYC</TableCell>
                  {/* If check complete, show completed; else, show button which opens modal */}
                  <TableCell className="txt-s fnt-ps table-text-pad">KYC</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="txt-s fnt-ps table-text-pad">AML</TableCell>
                  <TableCell className="txt-s fnt-ps table-text-pad">AML</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="txt-s fnt-ps table-text-pad">Accreditation</TableCell>
                  <TableCell className="txt-s fnt-ps table-text-pad">Accreditation</TableCell>
                </TableRow>
              </TableBody>
            </Table>
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
