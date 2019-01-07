import React, { Component } from "react";
import { Table, Button, Dropdown, Card, CardContent, Feed } from "semantic-ui-react";
import { connect } from "react-redux";
import Proptypes from "prop-types";
import { logoutUserAction } from "../../actions/authActions";
import { onDropdownChange } from "../../actions/marketMakerActions";
import { getTokenBalance } from "../../actions/userActions";
import web3 from "../../helpers/web3";
import { Grid } from "../../helpers/react-flexbox-grid";
import CustomCard from "../../components/CustomMUI/CUICard";

class MarketMakerDashboard extends Component {
  onLogoutClick = e => {
    const { logoutUserAction: logoutUser } = this.props;
    const { history } = this.props || {};
    logoutUser(history);
  };

  onDropdownChange = (e, d) => {
    const { onDropdownChange: dropDownChange } = this.props;
    dropDownChange(d.value);
  };

  componentDidMount() {
    const { getTokenBalance: fetchTokenBalance } = this.props;
    fetchTokenBalance(localStorage.publicAddress);
  }

  render() {
    const { marketMaker, userData } = this.props || {};
    const { dropDownSelect } = marketMaker;
    const { tokenBalance } = userData;
    const tokenOptions = [{ key: "LMD", value: "LMD", text: "LMD" }, { key: "RIV", value: "RIV", text: "RIV" }];
    return (
      <Grid>
        <h2>Market Maker</h2>

        <div>
          Select Token : <Dropdown onChange={this.onDropdownChange} selection placeholder="Select Token" options={tokenOptions} />
        </div>
        {dropDownSelect === "RIV" ? (
          <CustomCard className="card-brdr" style={{ padding: "50px", width: "50%" }}>
            <div>Token Balance: {tokenBalance}</div>
            <div>Token Ether Scan Link</div>
            <div>Reserve Mapper Order Scan Link</div>
          </CustomCard>
        ) : dropDownSelect === "LMD" ? (
          <CustomCard className="card-brdr" style={{ padding: "50px", width: "50%" }}>
            <div>Token Balance: {tokenBalance}</div>
            <div>Token Ether Scan Link</div>
            <div>Reserve Mapper Order Scan Link</div>
          </CustomCard>
        ) : (
          <div />
        )}
        <Table celled>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Token Name</Table.HeaderCell>
              <Table.HeaderCell>Token Count</Table.HeaderCell>
              <Table.HeaderCell>Token Price</Table.HeaderCell>
              <Table.HeaderCell>Options</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            <Table.Row>
              <Table.Cell>LMD</Table.Cell>
              <Table.Cell>{tokenBalance}</Table.Cell>
              <Table.Cell>{tokenBalance * 1}</Table.Cell>
              <Table.Cell>
                <Button primary>Buy</Button>
                <Button primary>Sell</Button>
              </Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>RIV</Table.Cell>
              <Table.Cell>{tokenBalance}</Table.Cell>
              <Table.Cell>{tokenBalance * 10}</Table.Cell>
              <Table.Cell>
                <Button primary>Buy</Button>
                <Button primary>Sell</Button>
              </Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table>
        <Button onClick={this.onLogoutClick}>Logout</Button>
      </Grid>
    );
  }
}

MarketMakerDashboard.propTypes = {
  logoutUserAction: Proptypes.func.isRequired,
  onDropdownChange: Proptypes.func.isRequired,
  getTokenBalance: Proptypes.func.isRequired
};

const mapStateToProps = state => {
  const { marketMaker, userData } = state;
  return {
    marketMaker,
    userData
  };
};

export default connect(
  mapStateToProps,
  { logoutUserAction, onDropdownChange, getTokenBalance }
)(MarketMakerDashboard);
