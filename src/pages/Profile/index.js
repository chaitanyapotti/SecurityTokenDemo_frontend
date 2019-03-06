import React, { PureComponent, lazy } from "react";
import { connect } from "react-redux";
import { AccountCircle, Lock } from "@material-ui/icons";
import axios from "axios";
import { Paper, Table, TableBody, TableCell, TableHead, TableRow } from "@material-ui/core";
import LoadingButton from "../../components/common/LoadingButton";
import { Grid, Row, Col } from "../../helpers/react-flexbox-grid";
import { amlComplyCheck } from "../../actions/amlActions";
import Navbar from "../../containers/Navbar";
import constants from "../../helpers/constants";
import AmlModal from "../../components/AmlModal";
import configuration from "../../config";
import actionTypes from "../../actionTypes";
import store from "../../store";

let onfido;
let investReady = {};

class Profile extends PureComponent {
  state = {
    modalOpen: false,
    irFrame: false,
    onfidoLoading: false
  };

  componentWillUnmount() {
    if (onfido) onfido.tearDown();
  }

  triggerIR = () => {
    this.setState({ irFrame: true });
    investReady = window.IR.init("1X4Qzd156ctlAs51JU88gk3c0CZTl3On1TdB7fGe");
  };

  triggerOnfido = async () => {
    const { first_name, last_name, id: user_id } = this.props || {};
    this.setState({ onfidoLoading: true });
    const config = {
      headers: {
        common: {
          Authorization: "Token token=test_ZaRgJLgxxomSw7FPT8x7DcrAABb14dKl",
          "Access-Control-Allow-Origin": "*"
        }
      }
    };
    try {
      const res = await axios.post(
        `${"https://cors-anywhere.herokuapp.com/"}https://api.onfido.com/v2/applicants`,
        { first_name, last_name },
        config
      );
      const { id } = res.data || {};
      const response = await axios.post(
        `${"https://cors-anywhere.herokuapp.com/"}https://api.onfido.com/v2/sdk_token`,
        { applicant_id: id, referrer: "*://*/*" },
        config
      );
      const { token } = response.data || "";
      import("onfido-sdk-ui")
        .then(Onfido => {
          onfido = Onfido.init({
            useModal: true,
            isModalOpen: true,
            onModalRequestClose() {
              // Update options with the state of the modal
              onfido.setOptions({ isModalOpen: false });
            },
            token,
            onComplete(data) {
              axios
                .patch(`${configuration.api}/api/users/status?id=${user_id}`, { status: constants.APPROVED, field: "kycStatus" })
                .then(kycResponse => {
                  const stringified = JSON.stringify(kycResponse.data);
                  localStorage.setItem("user_data", stringified);
                  store.dispatch({
                    type: actionTypes.SET_USER_DATA,
                    payload: stringified
                  });
                })
                .catch(err => console.log(err));
            }
          });
        })
        .catch(err => console.log("error importing onfido api"));
    } catch (error) {
      console.log(error.message);
    } finally {
      this.setState({ onfidoLoading: false });
    }
  };

  getProStatus = role => (role === constants.MARKET_MAKER ? "Market Maker" : role === constants.BROKER_DEALER ? "Broker Dealer" : "Pro-Investor");

  render() {
    const { first_name, email, phone, id, role, date, status, last_name, kycStatus, amlStatus, accreditationStatus, matchStatus } = this.props || {};
    const { modalOpen, irFrame, onfidoLoading } = this.state;

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
                  {status === constants.APPROVED ? "All checks are done" : "You still need to do some checks"}
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
                      <TableCell className="txt-s fnt-ps table-text-pad">{kycStatus}</TableCell>
                      {kycStatus !== constants.APPROVED ? (
                        <TableCell className="txt-s fnt-ps table-text-pad">
                          <LoadingButton
                            style={{ marginTop: "20px" }}
                            className="btn bg--primary txt-p-vault txt-dddbld text--white"
                            loading={onfidoLoading}
                            onClick={this.triggerOnfido}
                          >
                            Proceed
                          </LoadingButton>
                        </TableCell>
                      ) : (
                        <TableCell className="txt-s fnt-ps table-text-pad">{constants.COMPLETED}</TableCell>
                      )}
                    </TableRow>
                    <TableRow>
                      <TableCell className="txt-s fnt-ps table-text-pad">AML</TableCell>
                      <TableCell className="txt-s fnt-ps table-text-pad">{amlStatus}</TableCell>
                      {amlStatus !== constants.APPROVED ? (
                        <TableCell className="txt-s fnt-ps table-text-pad">
                          <LoadingButton
                            style={{ marginTop: "20px" }}
                            className="btn bg--primary txt-p-vault txt-dddbld text--white"
                            onClick={() => this.setState({ modalOpen: true })}
                          >
                            Proceed
                          </LoadingButton>
                        </TableCell>
                      ) : (
                        <TableCell className="txt-s fnt-ps table-text-pad">{constants.COMPLETED}</TableCell>
                      )}
                    </TableRow>
                    <TableRow>
                      <TableCell className="txt-s fnt-ps table-text-pad">ACRED</TableCell>
                      <TableCell className="txt-s fnt-ps table-text-pad">{accreditationStatus}</TableCell>
                      {accreditationStatus !== constants.APPROVED ? (
                        <TableCell className="txt-s fnt-ps table-text-pad">
                          <LoadingButton
                            style={{ marginTop: "20px" }}
                            className="btn bg--primary txt-p-vault txt-dddbld text--white"
                            onClick={() => this.triggerIR()}
                          >
                            Proceed
                          </LoadingButton>
                        </TableCell>
                      ) : (
                        <TableCell className="txt-s fnt-ps table-text-pad">{constants.COMPLETED}</TableCell>
                      )}
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
            title="investReadyFrame"
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
    userData: { first_name, email, phone, id, role, date, status, last_name, kycStatus, amlStatus, accreditationStatus }
  } = state.auth || {};
  return {
    first_name,
    last_name,
    email,
    phone,
    id,
    role,
    date,
    status,
    kycStatus,
    amlStatus,
    accreditationStatus
  };
};

export default connect(
  mapStatesToProps,
  {}
)(Profile);
