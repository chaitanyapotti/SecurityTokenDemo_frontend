import React, { PureComponent } from "react";
import { Table } from "semantic-ui-react";
import { formatCurrencyNumber, formatMoney, getEtherScanAddressLink, significantDigits } from "../../helpers/numberHelpers";
import config from "../../config";

class PortfolioTable extends PureComponent {
  render() {
    const { currentHoldings } = this.props || {};
    return (
      <Table celled>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Token Name</Table.HeaderCell>
            <Table.HeaderCell>Token Count</Table.HeaderCell>
            <Table.HeaderCell>Invested Value($)</Table.HeaderCell>
            <Table.HeaderCell>Current Value($)</Table.HeaderCell>
            <Table.HeaderCell>Token Price($)</Table.HeaderCell>
            <Table.HeaderCell>Change</Table.HeaderCell>
            <Table.HeaderCell>Commission</Table.HeaderCell>
            <Table.HeaderCell>EtherScan</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {Object.keys(config.tokens).map(key => {
            const { tokenCount, totalInvested, currentNetPrice, changePercent, changeValue, commission } = currentHoldings[key] || {};
            return (
              <Table.Row key={key}>
                <Table.Cell>{config.tokens[key].name}</Table.Cell>
                <Table.Cell>{formatCurrencyNumber(tokenCount || 0, 0)}</Table.Cell>
                <Table.Cell>{formatMoney(totalInvested || 0, 0)}</Table.Cell>
                <Table.Cell>{formatMoney(currentNetPrice || 0, 0)}</Table.Cell>
                <Table.Cell>{significantDigits(currentNetPrice / tokenCount || 0)}</Table.Cell>
                <Table.Cell>{`+${formatMoney(changeValue || 0, 0)}(+${Math.round(changePercent || 0, 2)}%)`}</Table.Cell>
                <Table.Cell>{formatMoney(commission || 0, 0)}</Table.Cell>
                <Table.Cell>
                  <span>
                    <a href={getEtherScanAddressLink(config.tokens[key].address, "rinkeby")} target="_blank" rel="noopener noreferrer">
                      View on Blockchain
                    </a>
                  </span>
                </Table.Cell>
              </Table.Row>
            );
          })}
        </Table.Body>
      </Table>
    );
  }
}

export default PortfolioTable;
