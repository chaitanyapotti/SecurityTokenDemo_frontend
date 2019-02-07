import React, { PureComponent } from "react";
import { Table } from "semantic-ui-react";
import { formatCurrencyNumber, formatMoney } from "../../helpers/numberHelpers";
import config from "../../config";

class TokenPriceTable extends PureComponent {
  render() {
    const { buyPriceData, sellPriceData, currentPortfolioValue, tokenBalance } = this.props || {};
    return (
      <Table celled>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Token Name</Table.HeaderCell>
            <Table.HeaderCell>Token Count</Table.HeaderCell>
            <Table.HeaderCell>Token Value($)</Table.HeaderCell>
            <Table.HeaderCell>Token Price($)</Table.HeaderCell>
            <Table.HeaderCell>Bid Price($)</Table.HeaderCell>
            <Table.HeaderCell>Ask Price($)</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {Object.keys(tokenBalance).map(key => {
            const buyDollarPrice = buyPriceData[key] && buyPriceData[key].price ? buyPriceData[key].price * config.etherPrice : 0;
            const sellDollarPrice = sellPriceData[key] && sellPriceData[key].price ? config.etherPrice / sellPriceData[key].price : 0;
            return (
              <Table.Row key={key}>
                <Table.Cell verticalAlign="middle">{config.tokens[key].name}</Table.Cell>
                <Table.Cell verticalAlign="middle">{formatCurrencyNumber(tokenBalance[key].balance, 0)}</Table.Cell>
                <Table.Cell verticalAlign="middle">{formatMoney(currentPortfolioValue[key], 0)}</Table.Cell>
                <Table.Cell verticalAlign="middle">{parseFloat(currentPortfolioValue[key] / tokenBalance[key].balance).toFixed(3)}</Table.Cell>
                <Table.Cell verticalAlign="middle">{sellDollarPrice.toFixed(3)}</Table.Cell>
                <Table.Cell verticalAlign="middle">{buyDollarPrice.toFixed(3)}</Table.Cell>
              </Table.Row>
            );
          })}
        </Table.Body>
      </Table>
    );
  }
}

export default TokenPriceTable;
