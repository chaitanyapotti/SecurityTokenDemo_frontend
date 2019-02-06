import React, { PureComponent } from "react";
import { Table, TableBody, TableCell, TableHead, TableRow, Paper } from "@material-ui/core";
import { formatCurrencyNumber, formatMoney, getEtherScanAddressLink } from "../../helpers/numberHelpers";
import config from "../../config";

class HoldingsTable extends PureComponent {
  render() {
    const { tokenBalance, currentPortfolioValue } = this.props || {};
    return (
      <Paper style={{ marginBottom: "20px" }} className="card-brdr">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Token Name</TableCell>
              <TableCell>Token Count</TableCell>
              <TableCell>Invested Value($)</TableCell>
              <TableCell>Current Value($)</TableCell>
              <TableCell>Change</TableCell>
              <TableCell>Token Price</TableCell>
              <TableCell>EtherScan</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Object.keys(tokenBalance).map(key => (
              <TableRow key={key}>
                <TableCell>{config.tokens[key].name}</TableCell>
                <TableCell>{formatCurrencyNumber(tokenBalance[key].balance, 0)}</TableCell>
                <TableCell>{formatMoney(tokenBalance[key].dollarValue, 0)}</TableCell>
                <TableCell>{formatMoney(currentPortfolioValue[key], 0)}</TableCell>
                <TableCell>
                  {`+${formatMoney(currentPortfolioValue[key] - tokenBalance[key].dollarValue, 0)}(+${Math.round(
                    ((currentPortfolioValue[key] - tokenBalance[key].dollarValue) * 100) / tokenBalance[key].dollarValue,
                    2
                  )}%)`}
                </TableCell>
                <TableCell>{formatMoney(currentPortfolioValue[key] / tokenBalance[key].balance || 0, 2)}</TableCell>
                <TableCell>
                  <span>
                    <a href={getEtherScanAddressLink(config.tokens[key].address, "rinkeby")} target="_blank" rel="noopener noreferrer">
                      View on Blockchain
                    </a>
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    );
  }
}

export default HoldingsTable;
