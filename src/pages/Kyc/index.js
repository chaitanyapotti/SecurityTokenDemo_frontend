import React from "react";
import Onfido from "onfido-sdk-ui";
import { connect } from "react-redux";
import Button from "@material-ui/core/Button";
import { kycAuth, kycSdkToken } from "../../actions/kycAuth";
import { amlComplyCheck } from "../../actions/amlActions";
import Navbar from "../../containers/Navbar";
import { Grid, Row, Col } from "../../helpers/react-flexbox-grid";
import CUICard from "../../components/CustomMUI/CUICard";
import AmlModal from "../../components/AmlModal";

let onfido = {};
class Kyc extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      modalOpen: false
    };
  }

  componentDidMount() {
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

  render() {
    const { id, sdkToken, matchStatus } = this.props || {};
    const { modalOpen } = this.state || {};
    return (
      <div>
        <Navbar />
        <Grid style={{ marginTop: "100px" }}>
          <Row>
            <Col xs={6}>
              <CUICard style={{ marginTop: "10px", padding: "50px 50px" }} onClick={() => this.triggerOnfido(sdkToken)}>
                <div className="text-center">
                  <img src="https://img.timesnownews.com/story/1520272646-kyc-zeta.jpg?d=600x450" width="200" height="300" />
                  <div>KYC Pending</div>
                  <Button style={{ marginTop: "20px" }} className="btn bg--primary txt-p-vault txt-dddbld text--white">
                    Proceed for KYC
                  </Button>
                </div>
              </CUICard>
            </Col>
            <Col xs={6}>
              <CUICard style={{ marginTop: "10px", padding: "50px 50px" }}>
                {matchStatus === "no_match" ? (
                  <div>You Passed the AML check</div>
                ) : (
                  <div>
                    <div>Do Anti Money Laundering Check (AML) </div>
                    <Button
                      style={{ marginTop: "20px" }}
                      className="btn bg--primary txt-p-vault txt-dddbld text--white"
                      onClick={() => this.setState({ modalOpen: true })}
                    >
                      Proceed for AML
                    </Button>
                  </div>
                )}
              </CUICard>
            </Col>
          </Row>
        </Grid>

        <AmlModal modalOpen={modalOpen} handleClose={() => this.setState({ modalOpen: false })} />
        <div id="onfido-mount" />
      </div>
    );
  }
}

const mapStateToProps = state => {
  const { id, sdkToken } = state.kycAuth || {};
  const { matchStatus } = state.amlCheck || {};
  return {
    id,
    sdkToken,
    matchStatus
  };
};

export default connect(
  mapStateToProps,
  { kycAuth, kycSdkToken, amlComplyCheck }
)(Kyc);
