import React, { PureComponent } from "react";
import { getEtherScanHashLink } from "../../../helpers/numberHelpers";
import LoadingButton from "../LoadingButton";
import CustomToolTip from "./CustomToolTip";

class Transaction extends PureComponent {
  render() {
    const { txHash, buttonSpinning, onClick, buttonText, success } = this.props || {};
    const link = getEtherScanHashLink(txHash, "rinkeby");
    return (
      <div>
        {success ? (
          <div className="hli">
            <CustomToolTip title="Trade not relevant now" id="btn-disabled" disabled>
              <span>
                <LoadingButton style={{ padding: "0 40px" }} disabled>
                  {buttonText}
                </LoadingButton>
              </span>
            </CustomToolTip>
          </div>
        ) : txHash !== "" ? (
          <div className="hli">
            <a href={link} target="_blank" rel="noreferrer noopener">
              <LoadingButton type="pending" style={{ padding: "0 40px" }} onClick={() => console.log("Sent to etherscan")}>
                Status
              </LoadingButton>
            </a>
          </div>
        ) : (
          <span className="hli">
            <LoadingButton style={{ padding: "0 40px" }} onClick={onClick} loading={buttonSpinning}>
              {buttonText}
            </LoadingButton>
          </span>
        )}
      </div>
    );
  }
}

export default Transaction;