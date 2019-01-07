import React, { PureComponent } from "react";
import { Table } from "semantic-ui-react";
import { formatCurrencyNumber, formatMoney } from "../../helpers/numberHelpers";

class HoldingsTable extends PureComponent {
  render() {
    const { tokenBalance } = this.props || {};
    return (
      <Table celled>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Token Name</Table.HeaderCell>
            <Table.HeaderCell>Token Count</Table.HeaderCell>
            <Table.HeaderCell>Token Value(USD)</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {Object.keys(tokenBalance).map(key => (
            <Table.Row key={key}>
              <Table.Cell>{key}</Table.Cell>
              <Table.Cell>{formatCurrencyNumber(tokenBalance[key].balance, 0)}</Table.Cell>
              <Table.Cell>{formatMoney(tokenBalance[key].dollarValue, 0)}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    );
  }
}

export default HoldingsTable;
