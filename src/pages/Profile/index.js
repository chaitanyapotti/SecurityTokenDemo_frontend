import React, { PureComponent } from "react";
import { connect } from "react-redux";
import { AccountCircle, Lock } from "@material-ui/icons";
import axios from "axios";
import { Paper, Table, TableBody, TableCell, TableHead, TableRow } from "@material-ui/core";
import LoadingButton from "../../components/common/LoadingButton";
import { Grid, Row, Col } from "../../helpers/react-flexbox-grid";
import { setUserData } from "../../actions/authActions";
import Navbar from "../../containers/Navbar";
import constants from "../../helpers/constants";
import AmlModal from "../../components/AmlModal";
import configuration from "../../config";
import store from "../../store";

let onfido;
class Profile extends PureComponent {
  state = {
    modalOpen: false,
    irFrame: false,
    onfidoLoading: false
  };

  componentDidMount() {
    const { isAuthenticated, history } = this.props || {};
    if (!isAuthenticated) {
      history.push("/");
    }
  }

  componentDidUpdate(prevProps) {
    const { matchStatus } = prevProps || {};
    const { matchStatus: newMatch, id } = this.props || {};
    if (matchStatus !== newMatch) {
      this.handleModalClose();
    }
    if (matchStatus !== newMatch && newMatch === constants.NO_MATCH) {
      axios
        .patch(`${configuration.api}/api/users/status?id=${id}`, { status: constants.APPROVED, field: "amlStatus" })
        .then(amlResponse => {
          const stringified = JSON.stringify(amlResponse.data);
          localStorage.setItem("user_data", stringified);
          store.dispatch(setUserData(stringified));
        })
        .catch(err => console.log(err));
    }
  }

  componentWillUnmount() {
    if (onfido) onfido.tearDown();
  }

  triggerIR = () => {
    const { id } = this.props || {};
    this.setState({ irFrame: true });
    import("../../helpers/IRiFrame")
      .then(IR => {
        IR.default.init("1X4Qzd156ctlAs51JU88gk3c0CZTl3On1TdB7fGe");
        IR.default.complete = function IRComplete(data) {
          axios
            .patch(`${configuration.api}/api/users/status?id=${id}`, { status: constants.APPROVED, field: "accreditationStatus" })
            .then(amlResponse => {
              const stringified = JSON.stringify(amlResponse.data);
              localStorage.setItem("user_data", stringified);
              store.dispatch(setUserData(stringified));
              this.setState({ irFrame: false });
              delete document.getElementById("InvestReadyiFrame");
            })
            .catch(err => console.log(err));
        }.bind(this);
      })
      .catch(err => console.log("couldn't load investready script"));
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
                  store.dispatch(setUserData(stringified));
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

  handleModalClose = () => {
    this.setState({ modalOpen: false });
  };

  getProStatus = role => (role === constants.MARKET_MAKER ? "Market Maker" : role === constants.BROKER_DEALER ? "Broker Dealer" : "Pro-Investor");

  render() {
    const { first_name, email, phone, id, role, date, status, last_name, kycStatus, amlStatus, accreditationStatus } = this.props || {};
    const { modalOpen, irFrame, onfidoLoading } = this.state;

    return (
      <div>
        <Grid container="true">
          <Navbar />
          {irFrame ? (
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
                        <div>{date && date.slice(0, 10)}</div>
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
                          <a href="https://www4.idealsvdr.com/v3/two12/" target="_blank" rel="noreferrer noopener">
                            Connect with issuers <Lock />
                          </a>
                        </div>
                        <div className="push--top">
                          <a href="https://www4.idealsvdr.com/v3/two12/" target="_blank" rel="noreferrer noopener">
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
        <AmlModal modalOpen={modalOpen} handleClose={this.handleModalClose} />
        <div id="onfido-mount" />
      </div>
    );
  }
}

const mapStatesToProps = state => {
  const {
    userData: { first_name, email, phone, id, role, date, status, last_name, kycStatus, amlStatus, accreditationStatus },
    userData,
    isAuthenticated
  } = state.auth || {};
  const { matchStatus } = state.amlCheck || {};
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
    accreditationStatus,
    isAuthenticated,
    userData,
    matchStatus
  };
};

export default connect(
  mapStatesToProps,
  {}
)(Profile);
