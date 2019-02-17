import React, { PureComponent } from "react";
import { Table, TableBody, TableCell, TableHead, TableRow, Paper } from "@material-ui/core";
import { formatCurrencyNumber, formatMoney } from "../../helpers/numberHelpers";
import config from "../../config";

class TokenPriceTable extends PureComponent {
  render() {
    const { buyPriceData, sellPriceData, currentPortfolioValue, tokenBalance } = this.props || {};
    return (
      <Paper className="card-brdr push--ends">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell className="txt-s fnt-ps txt-dddbld table-text-pad  table-head-clr">Token Name</TableCell>
              <TableCell className="txt-s fnt-ps txt-dddbld table-text-pad  table-head-clr">Token Count</TableCell>
              <TableCell className="txt-s fnt-ps txt-dddbld table-text-pad  table-head-clr">Token Value($)</TableCell>
              <TableCell className="txt-s fnt-ps txt-dddbld table-text-pad  table-head-clr">Token Price($)</TableCell>
              <TableCell className="txt-s fnt-ps txt-dddbld table-text-pad  table-head-clr">Bid Price($)</TableCell>
              <TableCell className="txt-s fnt-ps txt-dddbld table-text-pad  table-head-clr">Ask Price($)</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Object.keys(tokenBalance).map(key => {
              const buyDollarPrice = buyPriceData[key] && buyPriceData[key].price ? buyPriceData[key].price * config.etherPrice : 0;
              const sellDollarPrice = sellPriceData[key] && sellPriceData[key].price ? config.etherPrice / sellPriceData[key].price : 0;
              return (
                <TableRow key={key}>
                  <TableCell className="txt-s fnt-ps table-text-pad">{config.tokens[key].name}</TableCell>
                  <TableCell className="txt-s fnt-ps table-text-pad">{formatCurrencyNumber(tokenBalance[key].balance, 0)}</TableCell>
                  <TableCell className="txt-s fnt-ps table-text-pad">{formatMoney(currentPortfolioValue[key], 0)}</TableCell>
                  <TableCell className="txt-s fnt-ps table-text-pad">
                    {parseFloat(currentPortfolioValue[key] / tokenBalance[key].balance).toFixed(3)}
                  </TableCell>
                  <TableCell className="txt-s fnt-ps table-text-pad">{sellDollarPrice.toFixed(3)}</TableCell>
                  <TableCell className="txt-s fnt-ps table-text-pad">{buyDollarPrice.toFixed(3)}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Paper>
    );
  }
}

export default TokenPriceTable;
