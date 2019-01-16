import React, { PureComponent } from "react";
import { Table } from "semantic-ui-react";
import config from "../../config";

class TransactionHistory extends PureComponent {
  render() {
    const { transactionHistory, dropDownSelect } = this.props || {};
    return (
      <Table celled>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Token Name</Table.HeaderCell>
            <Table.HeaderCell>Token Count</Table.HeaderCell>
            <Table.HeaderCell>Transaction Hash</Table.HeaderCell>
            <Table.HeaderCell>Transaction Type</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {transactionHistory[dropDownSelect].map(item => {
            const token_name = config.tokens[Object.keys(config.tokens).find(keyy => config.tokens[keyy].address === item.token_address)].name;
            const { token_count, transaction_hash, transaction_type } = item;
            return (
              <Table.Row key={transaction_hash}>
                <Table.Cell>{token_name}</Table.Cell>
                <Table.Cell>{token_count}</Table.Cell>
                <Table.Cell>{transaction_hash}</Table.Cell>
                <Table.Cell>{transaction_type}</Table.Cell>
              </Table.Row>
            );
          })}
        </Table.Body>
      </Table>
    );
  }
}

export default TransactionHistory;
