import React, { PureComponent } from "react";
import { Table, TableBody, TableCell, TableHead, TableRow, Paper } from "@material-ui/core";
import config from "../../config";
import { getEtherScanHashLink, significantDigits } from "../../helpers/numberHelpers";

class TransactionHistory extends PureComponent {
  render() {
    const { transactionHistory, dropDownSelect } = this.props || {};
    return (
      <Paper className="card-brdr push--ends">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell className="txt-s fnt-ps txt-dddbld table-text-pad  table-head-clr">Token Name</TableCell>
              <TableCell className="txt-s fnt-ps txt-dddbld table-text-pad  table-head-clr">Transaction Type</TableCell>
              <TableCell className="txt-s fnt-ps txt-dddbld table-text-pad  table-head-clr">Token Count</TableCell>
              <TableCell className="txt-s fnt-ps txt-dddbld table-text-pad  table-head-clr">EtherScan</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {transactionHistory &&
              transactionHistory[dropDownSelect].map(item => {
                const token = Object.keys(config.tokens).find(keyy => config.tokens[keyy].address === item.token_address);
                if (token) {
                  const token_name = token ? config.tokens[token].name : "";
                  const { token_count, transaction_hash, transaction_type } = item || {};
                  const etherScanLink = getEtherScanHashLink(transaction_hash, "rinkeby");
                  return (
                    <TableRow key={transaction_hash}>
                      <TableCell className="txt-s fnt-ps table-text-pad">{token_name}</TableCell>
                      <TableCell className="txt-s fnt-ps table-text-pad">{transaction_type}</TableCell>
                      <TableCell className="txt-s fnt-ps table-text-pad">{significantDigits(token_count || 0)}</TableCell>
                      <TableCell className="txt-s fnt-ps table-text-pad">
                        <span>
                          <a href={etherScanLink} target="_blank" rel="noopener noreferrer">
                            View on Blockchain
                          </a>
                        </span>
                      </TableCell>
                    </TableRow>
                  );
                }
                return null;
              })}
          </TableBody>
        </Table>
      </Paper>
    );
  }
}

export default TransactionHistory;
