import React, { PureComponent } from "react";
import { connect } from "react-redux";
import Onfido from "onfido-sdk-ui";
import { AccountCircle, Lock } from "@material-ui/icons";
import { Paper, Table, TableBody, TableCell, TableHead, TableRow, Button } from "@material-ui/core";
import { Grid, Row, Col } from "../../helpers/react-flexbox-grid";
import { kycAuth, kycSdkToken } from "../../actions/kycAuth";
import { amlComplyCheck } from "../../actions/amlActions";
import Navbar from "../../containers/Navbar";
import constants from "../../helpers/constants";
import AmlModal from "../../components/AmlModal";

let onfido = {};
let investReady = {};
class Profile extends PureComponent {
  state = {
    modalOpen: false,
    irFrame: false
  };

  componentDidMount() {
    // window.onload = function(e) {
    // window.IR.init("1X4Qzd156ctlAs51JU88gk3c0CZTl3On1TdB7fGe");
    // };
    // this.props.kycAuth();
  }

  // componentWillReceiveProps(nextProps) {
  //   console.log("compoeenenewilll", nextProps, this.props);
  //   if (nextProps.id !== this.props.id) {
  //     this.props.kycSdkToken(nextProps.id);
  //   }
  // }

  componentWillUnmount() {
    onfido.tearDown();
  }

  triggerIR = () => {
    this.setState({ irFrame: true });
    investReady = window.IR.init("1X4Qzd156ctlAs51JU88gk3c0CZTl3On1TdB7fGe");
  };

  triggerOnfido = sdkToken => {
    onfido = Onfido.init({
      useModal: true,
      isModalOpen: true,
      onModalRequestClose() {
        // Update options with the state of the modal
        onfido.setOptions({ isModalOpen: false });
      },
      token: sdkToken,
      onComplete(data) {
        // callback for when everything is complete
        console.log("everything is complete", data);
      }
    });
  };

  getProStatus = role => (role === constants.MARKET_MAKER ? "Market Maker" : role === constants.BROKER_DEALER ? "Broker Dealer" : "Pro-Investor");

  render() {
    const { first_name, email, phone, id, role, date, status, last_name, sdkToken, matchStatus } = this.props || {};
    const { modalOpen, irFrame } = this.state || {};

    return (
      <div>
        <Grid container="true">
          <Navbar />
          {irFrame ? (
            <div />
          ) : (
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
                      <TableCell className="txt-s fnt-ps txt-dddbld table-head-clr">Verification</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell className="txt-s fnt-ps table-text-pad">KYC</TableCell>
                      {/* If check complete, show completed; else, show button which opens modal */}
                      <TableCell className="txt-s fnt-ps table-text-pad">KYC</TableCell>
                      <TableCell className="txt-s fnt-ps table-text-pad">
                        <Button
                          style={{ marginTop: "20px" }}
                          className="btn bg--primary txt-p-vault txt-dddbld text--white"
                          onClick={() => this.triggerOnfido(sdkToken)}
                        >
                          Proceed for KYC
                        </Button>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="txt-s fnt-ps table-text-pad">AML</TableCell>
                      <TableCell className="txt-s fnt-ps table-text-pad">AML</TableCell>
                      <TableCell className="txt-s fnt-ps table-text-pad">
                        <Button
                          style={{ marginTop: "20px" }}
                          className="btn bg--primary txt-p-vault txt-dddbld text--white"
                          onClick={() => this.setState({ modalOpen: true })}
                        >
                          Proceed for AML
                        </Button>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="txt-s fnt-ps table-text-pad">Accreditation</TableCell>
                      <TableCell className="txt-s fnt-ps table-text-pad">Accreditation</TableCell>
                      <TableCell className="txt-s fnt-ps table-text-pad">
                        <Button
                          style={{ marginTop: "20px" }}
                          className="btn bg--primary txt-p-vault txt-dddbld text--white"
                          onClick={() => this.triggerIR()}
                        >
                          Proceed for Accredition
                        </Button>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </Paper>
            </div>
          )}
        </Grid>
        <AmlModal modalOpen={modalOpen} handleClose={() => this.setState({ modalOpen: false })} />
        <div id="onfido-mount" />
        <div className="push-top--50">
          <iframe
            style={{ border: "0px #ffffff none" }}
            id="InvestReadyiFrame"
            name="InvestReady"
            scrolling="false"
            frameBorder="0"
            marginHeight="0px"
            marginWidth="0px"
            height="100vh"
            width="100%"
            allowFullScreen
          />
        </div>
      </div>
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
