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
              <TableCell className="txt-s">Token Name</TableCell>
              <TableCell className="txt-s">Token Count</TableCell>
              <TableCell className="txt-s">Invested Value($)</TableCell>
              <TableCell className="txt-s">Current Value($)</TableCell>
              <TableCell className="txt-s">Change</TableCell>
              <TableCell className="txt-s">Token Price</TableCell>
              <TableCell className="txt-s">EtherScan</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Object.keys(tokenBalance).map(key => (
              <TableRow key={key}>
                <TableCell className="txt-s">{config.tokens[key].name}</TableCell>
                <TableCell className="txt-s">{formatCurrencyNumber(tokenBalance[key].balance, 0)}</TableCell>
                <TableCell className="txt-s">{formatMoney(tokenBalance[key].dollarValue, 0)}</TableCell>
                <TableCell className="txt-s">{formatMoney(currentPortfolioValue[key], 0)}</TableCell>
                <TableCell className="txt-s">
                  {`+${formatMoney(currentPortfolioValue[key] - tokenBalance[key].dollarValue, 0)}(+${Math.round(
                    ((currentPortfolioValue[key] - tokenBalance[key].dollarValue) * 100) / tokenBalance[key].dollarValue,
                    2
                  )}%)`}
                </TableCell>
                <TableCell className="txt-s">{formatMoney(currentPortfolioValue[key] / tokenBalance[key].balance || 0, 2)}</TableCell>
                <TableCell className="txt-s">
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
