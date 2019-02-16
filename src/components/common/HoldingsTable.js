import React, { PureComponent } from "react";
import { Table, TableBody, TableCell, TableHead, TableRow, Paper } from "@material-ui/core";
import { formatCurrencyNumber, formatMoney, getEtherScanAddressLink } from "../../helpers/numberHelpers";
import config from "../../config";

class HoldingsTable extends PureComponent {
  render() {
    const { tokenBalance, currentPortfolioValue } = this.props || {};
    return (
      <Paper className="card-brdr push--ends">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell className="txt-s txt-dddbld table-text-pad  table-head-clr">Token Name</TableCell>
              <TableCell className="txt-s txt-dddbld table-text-pad  table-head-clr">Token Count</TableCell>
              <TableCell className="txt-s txt-dddbld table-text-pad  table-head-clr">Invested Value($)</TableCell>
              <TableCell className="txt-s txt-dddbld table-text-pad  table-head-clr">Current Value($)</TableCell>
              <TableCell className="txt-s txt-dddbld table-text-pad  table-head-clr">Change</TableCell>
              <TableCell className="txt-s txt-dddbld table-text-pad  table-head-clr">Token Price</TableCell>
              <TableCell className="txt-s txt-dddbld table-text-pad  table-head-clr">EtherScan</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Object.keys(tokenBalance).map(key => (
              <TableRow key={key}>
                <TableCell className="txt-s table-text-pad">{config.tokens[key].name}</TableCell>
                <TableCell className="txt-s table-text-pad">{formatCurrencyNumber(tokenBalance[key].balance, 0)}</TableCell>
                <TableCell className="txt-s table-text-pad">{formatMoney(tokenBalance[key].dollarValue, 0)}</TableCell>
                <TableCell className="txt-s table-text-pad">{formatMoney(currentPortfolioValue[key], 0)}</TableCell>
                <TableCell className="txt-s table-text-pad">
                  {`+${formatMoney(currentPortfolioValue[key] - tokenBalance[key].dollarValue, 0)}(+${Math.round(
                    ((currentPortfolioValue[key] - tokenBalance[key].dollarValue) * 100) / tokenBalance[key].dollarValue,
                    2
                  )}%)`}
                </TableCell>
                <TableCell className="txt-s table-text-pad">{formatMoney(currentPortfolioValue[key] / tokenBalance[key].balance || 0, 2)}</TableCell>
                <TableCell className="txt-s table-text-pad">
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
