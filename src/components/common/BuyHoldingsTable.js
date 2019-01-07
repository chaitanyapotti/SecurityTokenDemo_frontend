import React, { PureComponent } from "react";
import { Table, Button } from "semantic-ui-react";
import { formatCurrencyNumber, formatMoney } from "../../helpers/numberHelpers";
import config from "../../config";
import AlertModal from "./AlertModal";

class BuyHoldingsTable extends PureComponent {
  state = {
    buyModalOpen: false,
    sellModalOpen: false
  };

  handleBuyModalOpen = () => this.setState({ buyModalOpen: true });

  handleBuyModalClose = () => this.setState({ buyModalOpen: false });

  handleSellModalOpen = () => this.setState({ sellModalOpen: true });

  handleSellModalClose = () => this.setState({ sellModalOpen: false });

  onBuyClick = () => {
    this.setState({ buyModalOpen: true });
  };

  onSellClick = () => {
    this.setState({ sellModalOpen: true });
  };

  render() {
    const { tokenBalance } = this.props || {};
    const { buyModalOpen, sellModalOpen } = this.state;
    return (
      <div>
        <Table celled>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Token Name</Table.HeaderCell>
              <Table.HeaderCell>Token Count</Table.HeaderCell>
              <Table.HeaderCell>Token Value(USD)</Table.HeaderCell>
              <Table.HeaderCell>Action</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {Object.keys(tokenBalance).map(key => (
              <Table.Row key={key}>
                <Table.Cell verticalAlign="middle">{config.tokens[key].name}</Table.Cell>
                <Table.Cell verticalAlign="middle">{formatCurrencyNumber(tokenBalance[key].balance, 0)}</Table.Cell>
                <Table.Cell verticalAlign="middle">{formatMoney(tokenBalance[key].dollarValue, 0)}</Table.Cell>
                <Table.Cell>
                  <span>
                    <Button className="btn bg--primary txt-p-vault txt-dddbld text--white test" onClick={this.onBuyClick}>
                      Buy
                    </Button>
                  </span>
                  <span>
                    <Button className="btn bg--danger txt-p-vault txt-dddbld text--white test" onClick={this.onSellClick}>
                      Sell
                    </Button>
                  </span>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
        <AlertModal open={buyModalOpen} handleClose={this.handleBuyModalClose} />
        <AlertModal open={sellModalOpen} handleClose={this.handleSellModalClose} />
      </div>
    );
  }
}

export default BuyHoldingsTable;
