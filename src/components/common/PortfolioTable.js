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
              <TableCell className="txt-s">Token Name</TableCell>
              <TableCell className="txt-s">Token Count</TableCell>
              <TableCell className="txt-s">Invested Value($)</TableCell>
              <TableCell className="txt-s">Current Value($)</TableCell>
              <TableCell className="txt-s">Token Price($)</TableCell>
              <TableCell className="txt-s">Change</TableCell>
              <TableCell className="txt-s">Commission</TableCell>
              <TableCell className="txt-s">EtherScan</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Object.keys(config.tokens).map(key => {
              const { tokenCount, totalInvested, currentNetPrice, changePercent, changeValue, commission } = currentHoldings[key] || {};
              return (
                <TableRow key={key}>
                  <TableCell className="txt-s">{config.tokens[key].name}</TableCell>
                  <TableCell className="txt-s">{formatCurrencyNumber(tokenCount || 0, 0)}</TableCell>
                  <TableCell className="txt-s">{formatMoney(totalInvested || 0, 0)}</TableCell>
                  <TableCell className="txt-s">{formatMoney(currentNetPrice || 0, 0)}</TableCell>
                  <TableCell className="txt-s">{significantDigits(currentNetPrice / tokenCount || 0)}</TableCell>
                  <TableCell className="txt-s">{`+${formatMoney(changeValue || 0, 0)}(+${Math.round(changePercent || 0, 2)}%)`}</TableCell>
                  <TableCell className="txt-s">{formatMoney(commission || 0, 0)}</TableCell>
                  <TableCell className="txt-s">
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
