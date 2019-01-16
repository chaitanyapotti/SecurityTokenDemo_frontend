import React, { PureComponent } from "react";
import { Table } from "semantic-ui-react";
import config from "../../config";
import { getEtherScanHashLink, significantDigits } from "../../helpers/numberHelpers";

class TransactionHistory extends PureComponent {
  render() {
    const { transactionHistory, dropDownSelect } = this.props || {};
    return (
      <Table celled>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Token Name</Table.HeaderCell>
            <Table.HeaderCell>Transaction Type</Table.HeaderCell>
            <Table.HeaderCell>Token Count</Table.HeaderCell>
            <Table.HeaderCell>EtherScan</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {transactionHistory[dropDownSelect].map(item => {
            const token_name = config.tokens[Object.keys(config.tokens).find(keyy => config.tokens[keyy].address === item.token_address)].name;
            const { token_count, transaction_hash, transaction_type } = item || {};
            const etherScanLink = getEtherScanHashLink(transaction_hash, "rinkeby");
            return (
              <Table.Row key={transaction_hash}>
                <Table.Cell>{token_name}</Table.Cell>
                <Table.Cell>{transaction_type}</Table.Cell>
                <Table.Cell>{significantDigits(token_count)}</Table.Cell>
                <Table.Cell>
                  <span>
                    <a href={etherScanLink} target="_blank" rel="noopener noreferrer">
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

export default TransactionHistory;
