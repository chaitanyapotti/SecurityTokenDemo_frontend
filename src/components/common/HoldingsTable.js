import React, { PureComponent } from "react";
import { Table } from "semantic-ui-react";
import { formatCurrencyNumber, formatMoney, getEtherScanAddressLink, significantDigits } from "../../helpers/numberHelpers";
import config from "../../config";

class HoldingsTable extends PureComponent {
  render() {
    const { tokenBalance, currentPortfolioValue } = this.props || {};
    return (
      <Table celled>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Token Name</Table.HeaderCell>
            <Table.HeaderCell>Token Count</Table.HeaderCell>
            <Table.HeaderCell>Invested Value($)</Table.HeaderCell>
            <Table.HeaderCell>Current Value($)</Table.HeaderCell>
            <Table.HeaderCell>Change</Table.HeaderCell>
            <Table.HeaderCell>EtherScan</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {Object.keys(tokenBalance).map(key => (
            <Table.Row key={key}>
              <Table.Cell>{config.tokens[key].name}</Table.Cell>
              <Table.Cell>{formatCurrencyNumber(tokenBalance[key].balance, 0)}</Table.Cell>
              <Table.Cell>{formatMoney(tokenBalance[key].dollarValue, 0)}</Table.Cell>
              <Table.Cell>{formatMoney(currentPortfolioValue[key], 0)}</Table.Cell>
              <Table.Cell>{significantDigits(tokenBalance[key].dollarValue / tokenBalance[key].balance || 0)}</Table.Cell>
              <Table.Cell>
                {`+${formatMoney(currentPortfolioValue[key] - tokenBalance[key].dollarValue, 0)}(+${Math.round(
                  ((currentPortfolioValue[key] - tokenBalance[key].dollarValue) * 100) / tokenBalance[key].dollarValue,
                  2
                )}%)`}
              </Table.Cell>
              <Table.Cell>
                <span>
                  <a href={getEtherScanAddressLink(config.tokens[key].address, "rinkeby")} target="_blank" rel="noopener noreferrer">
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

export default HoldingsTable;
