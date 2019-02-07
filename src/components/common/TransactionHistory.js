import React, { PureComponent } from "react";
import { Table, TableBody, TableCell, TableHead, TableRow, Paper } from "@material-ui/core";
import config from "../../config";
import { getEtherScanHashLink, significantDigits } from "../../helpers/numberHelpers";

class TransactionHistory extends PureComponent {
  render() {
    const { transactionHistory, dropDownSelect } = this.props || {};
    return (
      <Paper style={{ marginBottom: "20px" }} className="card-brdr">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell className="txt-s">Token Name</TableCell>
              <TableCell className="txt-s">Transaction Type</TableCell>
              <TableCell className="txt-s">Token Count</TableCell>
              <TableCell className="txt-s">EtherScan</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {transactionHistory[dropDownSelect].map(item => {
              const token_name = config.tokens[Object.keys(config.tokens).find(keyy => config.tokens[keyy].address === item.token_address)].name;
              const { token_count, transaction_hash, transaction_type } = item || {};
              const etherScanLink = getEtherScanHashLink(transaction_hash, "rinkeby");
              return (
                <TableRow key={transaction_hash}>
                  <TableCell className="txt-s">{token_name}</TableCell>
                  <TableCell className="txt-s">{transaction_type}</TableCell>
                  <TableCell className="txt-s">{significantDigits(token_count)}</TableCell>
                  <TableCell className="txt-s">
                    <span>
                      <a href={etherScanLink} target="_blank" rel="noopener noreferrer">
                        View on Blockchain
                      </a>
                    </span>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Paper>
    );
  }
}

export default TransactionHistory;
