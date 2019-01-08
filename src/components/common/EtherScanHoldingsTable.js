import React, { PureComponent } from "react";
import { Table, Button } from "semantic-ui-react";
import { CustomToolTip } from "./FormComponents";
import { formatCurrencyNumber, formatMoney, getEtherScanAddressLink } from "../../helpers/numberHelpers";
import config from "../../config";

class EtherScanHoldingsTable extends PureComponent {
  render() {
    const { tokenBalance, isOperator } = this.props || {};
    return (
      <Table celled>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Token Name</Table.HeaderCell>
            <Table.HeaderCell>Token Count</Table.HeaderCell>
            <Table.HeaderCell>Token Value(USD)</Table.HeaderCell>
            <Table.HeaderCell>Deposit</Table.HeaderCell>
            <Table.HeaderCell>Withdraw</Table.HeaderCell>
            <Table.HeaderCell>Trade</Table.HeaderCell>
            <Table.HeaderCell>Etherscan</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {Object.keys(tokenBalance).map(key => (
            <Table.Row key={key}>
              <Table.Cell verticalAlign="middle">{config.tokens[key].name}</Table.Cell>
              <Table.Cell verticalAlign="middle">{formatCurrencyNumber(tokenBalance[key].balance, 0)}</Table.Cell>
              <Table.Cell verticalAlign="middle">{formatMoney(tokenBalance[key].dollarValue, 0)}</Table.Cell>
              <Table.Cell verticalAlign="middle">
                <CustomToolTip disabled={!isOperator} title="You are not the operator">
                  <span>
                    <Button className="btn bg--primary txt-p-vault txt-dddbld text--white test" disabled={!isOperator} onClick={this.onDepositClick}>
                      Deposit
                    </Button>
                  </span>
                </CustomToolTip>
              </Table.Cell>
              <Table.Cell verticalAlign="middle">
                <CustomToolTip disabled={!isOperator} title="You are not the operator">
                  <span>
                    <Button className="btn bg--danger txt-p-vault txt-dddbld text--white test" disabled={!isOperator} onClick={this.onWithdrawClick}>
                      Withdraw
                    </Button>
                  </span>
                </CustomToolTip>
              </Table.Cell>
              <Table.Cell verticalAlign="middle">
                <CustomToolTip disabled={!isOperator} title="You are not the operator">
                  <span>
                    <Button className="btn bg--pending txt-p-vault txt-dddbld text--white test" disabled={!isOperator} onClick={this.onTradeClick}>
                      Trade
                    </Button>
                  </span>
                </CustomToolTip>
              </Table.Cell>
              <Table.Cell>
                <span>
                  <a
                    className="btn bg--primary txt-p-vault txt-dddbld text--white"
                    href={getEtherScanAddressLink(config.tokens[key].address, "rinkeby")}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View on Blockchain
                  </a>
                </span>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    );
  }
}

export default EtherScanHoldingsTable;
