import React, { PureComponent } from "react";
import { Table, TableBody, TableCell, TableHead, TableRow, Paper } from "@material-ui/core";
import { formatCurrencyNumber, formatMoney, getEtherScanAddressLink, significantDigits } from "../../helpers/numberHelpers";
import config from "../../config";

class PortfolioTable extends PureComponent {
  render() {
    const { currentHoldings } = this.props || {};
    return (
      <Paper style={{ marginBottom: "20px" }} className="card-brdr">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Token Name</TableCell>
              <TableCell>Token Count</TableCell>
              <TableCell>Invested Value($)</TableCell>
              <TableCell>Current Value($)</TableCell>
              <TableCell>Token Price($)</TableCell>
              <TableCell>Change</TableCell>
              <TableCell>Commission</TableCell>
              <TableCell>EtherScan</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Object.keys(config.tokens).map(key => {
              const { tokenCount, totalInvested, currentNetPrice, changePercent, changeValue, commission } = currentHoldings[key] || {};
              return (
                <TableRow key={key}>
                  <TableCell>{config.tokens[key].name}</TableCell>
                  <TableCell>{formatCurrencyNumber(tokenCount || 0, 0)}</TableCell>
                  <TableCell>{formatMoney(totalInvested || 0, 0)}</TableCell>
                  <TableCell>{formatMoney(currentNetPrice || 0, 0)}</TableCell>
                  <TableCell>{significantDigits(currentNetPrice / tokenCount || 0)}</TableCell>
                  <TableCell>{`+${formatMoney(changeValue || 0, 0)}(+${Math.round(changePercent || 0, 2)}%)`}</TableCell>
                  <TableCell>{formatMoney(commission || 0, 0)}</TableCell>
                  <TableCell>
                    <span>
                      <a href={getEtherScanAddressLink(config.tokens[key].address, "rinkeby")} target="_blank" rel="noopener noreferrer">
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

export default PortfolioTable;
