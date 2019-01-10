import React, { PureComponent } from "react";
import { Table } from "semantic-ui-react";
import { formatCurrencyNumber, formatMoney, getEtherScanAddressLink } from "../../helpers/numberHelpers";
import config from "../../config";

class HoldingsTable extends PureComponent {
  render() {
    const { tokenBalance, priceHistory } = this.props || {};
    return (
      <Table celled>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Token Name</Table.HeaderCell>
            <Table.HeaderCell>Token Count</Table.HeaderCell>
            <Table.HeaderCell>Invested Value(USD)</Table.HeaderCell>
            <Table.HeaderCell>Current Value(USD)</Table.HeaderCell>
            <Table.HeaderCell>Change</Table.HeaderCell>
            {/* <Table.HeaderCell>EtherScan</Table.HeaderCell> */}
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {Object.keys(tokenBalance).map(key => (
            <Table.Row key={key}>
              <Table.Cell>{config.tokens[key].name}</Table.Cell>
              <Table.Cell>{formatCurrencyNumber(tokenBalance[key].balance, 0)}</Table.Cell>
              <Table.Cell>{formatMoney(tokenBalance[key].dollarValue, 0)}</Table.Cell>
              <Table.Cell>{formatMoney(tokenBalance[key].balance * priceHistory[key].currentprice * config.etherPrice, 0)}</Table.Cell>

              <Table.Cell>
                {`+${formatMoney(
                  tokenBalance[key].balance * priceHistory[key].currentprice * config.etherPrice - tokenBalance[key].dollarValue,
                  0
                )}(+${Math.round(
                  ((tokenBalance[key].balance * priceHistory[key].currentprice * config.etherPrice - tokenBalance[key].dollarValue) * 100) /
                    tokenBalance[key].dollarValue,
                  2
                )}%)`}
              </Table.Cell>
              {/* <Table.Cell>
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
              </Table.Cell> */}
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    );
  }
}

export default HoldingsTable;
