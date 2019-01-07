import React, { Component } from 'react';
import { connect } from "react-redux";
import { Grid, Tabs, Tab, Input, Button, Divider } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { CustomCard } from '../CustomMUI/CustomCardComponent';
import { CustomButton } from '../CustomMUI/CustomButton';
import { CustomTextField } from '../CustomMUI/CustomTextField';
import { getVoteHistogram } from '../../actions/pollFactoryActions';
import RCSlider from '../Common/RCSlider';
import { marketMakingSpreadChanged, startTradingBot, balanceRatios, balanceRatioChanged, balancingAggressionChanged,
   fetchDaiRate, manualAggressionChanged, manualEthChanged, startManualEthHedging, startManualDaiHedging, manualDaiChanged, checkHedging } from "../../actions/tradeActions";
import { getRemainingBalance } from "../../actions/pollFactoryActions";
 

const styles = theme => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper
  },
  tabRoot: {
    minWidth: '80px',
    textTransform: 'initial'
  }
});

class MarketMaking extends Component {
  handleTextChange = event => {
    this.props.dispatch(marketMakingSpreadChanged(event.target.value));
  };

  startTradingBotAction = () => {
    this.props.dispatch(startTradingBot(this.props.spreadPercentage, this.props.avgPrice, this.props.etherBalance + this.props.daiBalance*this.props.avgPrice));
  };

  render() {
    return (
      <div className="push--top">
        <Grid container>
          <Grid item lg={6}>
            <CustomTextField
              label="Spread Percentage"
              value={this.props.spreadPercentage}
              fullWidth
              onChange={this.handleTextChange}
            />
          </Grid>
          <Grid className="text--center" item lg={6}>
            <span>
              <CustomButton onClick={this.startTradingBotAction}>
                Initiate Bot
              </CustomButton>
            </span>
          </Grid>
        </Grid>
        <div className="push-half--top">
          1 ETH = {(1 / this.props.avgPrice).toFixed(2)} DAI{' '}
        </div>
      </div>
    );
  }
}

class DAIRatio extends Component {
  onChangeBalanceRatio = value => {
    this.props.dispatch(balanceRatioChanged(value));
  };

  startBalancingRatio = () => {
    this.props.dispatch(balanceRatios(this.props.balanceRatio, this.props.balancingAggressionFactor, this.props.etherBalance, this.props.daiBalance, this.props.avgPrice, this.props.current_ask, this.props.current_bid));
  };

  onChangeBalancingAggression = value => {
    this.props.dispatch(balancingAggressionChanged(value));
  };

  render() {
    return (
      <div className="push--top">
        <Grid container>
          <Grid item lg={9}>
            <div className="txt-bold">Balance Ratio</div>
            <span>
              <RCSlider
                onChange={this.onChangeBalanceRatio}
                value={this.props.balanceRatio}
                minimumTrackStyle={{ backgroundColor: '#4ca9fc' }}
              />
              <div>
                Percentage Of Portfolio in DAI :{' '}
                <span className="text--secondary">
                  {`${this.props.balanceRatio}%`}
                </span>
              </div>
            </span>
          </Grid>
          <Grid className="push--top" item lg={9}>
            <div className="txt-bold">Aggression Factor</div>
            <span>
              <RCSlider
                onChange={this.onChangeBalancingAggression}
                value={this.props.balancingAggressionFactor}
                min={1}
                max={5}
                step={1}
                dots
                dotStyle={{ borderColor: '#ff839b' }}
                activeDotStyle={{ borderColor: '#ff839b' }}
                minimumTrackStyle={{ backgroundColor: '#ff839b' }}
                handleStyle={{
                  borderColor: '#ff839b',
                  border: 'solid 2px #ff839b',
                  '&:active': {
                    boxShadow: '0 0 0 5px #ff839b'
                  }
                }}
              />
              <div>
                Aggression Level :{' '}
                <span className="text--secondary">
                  {this.props.balancingAggressionFactor}
                </span>
              </div>
            </span>
          </Grid>
          <Grid className="text--center push--top" item lg={3}>
            <span>
              <CustomButton onClick={this.startBalancingRatio}>
                Start Hedging
              </CustomButton>
            </span>
          </Grid>
        </Grid>

        <div className="push-half--top">
          1 ETH = {(1 / this.props.avgPrice).toFixed(2)} DAI{' '}
        </div>
        <div className="push-half--top">
          Your portfolio will gradually get rebalanced until{' '}
          {this.props.balanceRatio}% of its value is in DAI
        </div>
      </div>
    );
  }
}

class ManualData extends Component {
  state = {
    value: 0
  };

  handleChange = (event, value) => {
    this.setState({ value });
  };


  handleStartManualEthHedging = () =>{
    this.props.dispatch(startManualEthHedging(this.props.current_ask, this.props.current_bid, this.props.manualAggressionFactor, this.props.manualEthAmount*Math.pow(10, 18)))
  }

  handleManualEthChange = (event) => {
    this.props.dispatch(manualEthChanged(event.target.value))
  };

  handleStartManualDaiHedging = () =>{
    this.props.dispatch(startManualDaiHedging(this.props.current_ask, this.props.current_bid, this.props.manualAggressionFactor, parseInt(this.props.manualDaiAmount*this.props.avgPrice*Math.pow(10, 18)) ))
  }

  handleManualDaiChange = (event) => {
    this.props.dispatch(manualDaiChanged(event.target.value))
  };

  ConvertDai = props => (
    <div className="push--top">
      <Grid container>
        <Grid item lg={6}>
          <CustomTextField
            label="Amount of ETH"
            value={this.props.manualEthAmount}
            fullWidth
            onChange={this.handleManualEthChange}
          />
        </Grid>
        <Grid className="text--center" item lg={6}>
          <span>
            <CustomButton onClick={this.handleStartManualEthHedging}>Start Hedging</CustomButton>
          </span>
        </Grid>
      </Grid>
    </div>
  );

  ConvertEth = props => (
    <div className="push--top">
      <Grid container>
        <Grid item lg={6}>
          <CustomTextField
            label="Amount of DAI"
            value={this.props.manualDaiAmount}
            fullWidth
            onChange={this.handleManualDaiChange}
          />
        </Grid>
        <Grid className="text--center" item lg={6}>
          <span>
            <CustomButton onClick={this.handleStartManualDaiHedging}>Start Hedging</CustomButton>
          </span>
        </Grid>
      </Grid>
    </div>
  );

  onChangeManualAggression = value => {
    this.props.dispatch(manualAggressionChanged(value));
  };
  render() {
    const { value } = this.state || {};
    // const { classes } = this.props || {};
    // console.log('classes', classes, this.props);
    return (
      <div className="push--top">
        <Tabs
          // classes={classes.scrollButtons}
          value={value}
          onChange={this.handleChange}
        >
          <Tab label="Convert to DAI" />
          <Tab label="Convert to ETH" />
        </Tabs>
        {value === 0 && this.ConvertDai()}
        {value === 1 && this.ConvertEth()}
        <div>
          <span>
            <RCSlider
              onChange={this.onChangeManualAggression}
              value={this.props.manualAggressionFactor}
              min={1}
              max={5}
              step={1}
              dots
              dotStyle={{ borderColor: '#ff839b' }}
              activeDotStyle={{ borderColor: '#ff839b' }}
              minimumTrackStyle={{ backgroundColor: '#ff839b' }}
              handleStyle={{
                borderColor: '#ff839b',
                border: 'solid 2px #ff839b',
                '&:active': {
                  boxShadow: '0 0 0 5px #ff839b'
                }
              }}
            />
            <div>
              Aggression Level :{' '}
              <span className="text--secondary">
                {this.props.manualAggressionFactor}
              </span>
            </div>
          </span>
        </div>
        <div className="push-half--top">
          1 ETH = {(1 / this.props.avgPrice).toFixed(2)} DAI{' '}
        </div>
      </div>
    );
  }
}

class TradeCard extends Component {
  constructor(props) {
    super(props);
    this.interval = null;
    this.state = {
      value: 0
    };  
  }

  initCheckOnHedging() {
    if (!this.interval) {
      this.interval = setInterval(() => {
        this.props.dispatch(checkHedging(this.props.spreadPercentage,
          this.props.balanceRatio,
          this.props.balancingAggressionFactor,
          this.props.avgPrice,
          this.props.manualAggressionFactor,
          this.props.botStartedSuccessfully,
          this.props.currentStrategy,
          this.props.currentStrategyCode, 
          this.props.etherBalance, 
          this.props.daiBalance,
          this.props.current_ask,
          this.props.current_bid
          ));
      }, 1800000);
    }
  }
  
  componentDidMount(){
    this.props.dispatch(fetchDaiRate())
    this.props.dispatch(getRemainingBalance())
    this.initCheckOnHedging()
  }

  handleChange = (event, value) => {
    this.setState({ value });
  };

  render() {
    const { value } = this.state;
    const { classes } = this.props || {};
    return (
      <Grid container>
        <CustomCard className="card-brdr" style={{ width: '100%' }}>
          <Grid style={{ padding: '40px' }} item lg={12}>
            <Grid container>
              <Grid item lg={2}>
                <span
                  style={{ top: '8px' }}
                  className="text--primary txt-xl pos-rel"
                >
                  Trade
                </span>
              </Grid>
              <Grid item lg={10}>
                <Tabs value={value} onChange={this.handleChange}>
                  <Tab className={classes.tabRoot} label="Manual" />
                  <Tab className={classes.tabRoot} label="DAI Ratio" />
                  <Tab className={classes.tabRoot} label="Market Making" />
                </Tabs>
              </Grid>
            </Grid>
          </Grid>
          <Divider />
          <div style={{ padding: '20px 40px 40px' }}>
            {value === 0 && <ManualDataConnected />}
            {value === 1 && <DAIRatioConnected />}
            {value === 2 && <MarketMakingConnected />}
          </div>
        </CustomCard>
      </Grid>
    );
  }
}

// const mapDispatchToProps = dispatch =>
//   bindActionCreators(
//     {
//       marketMakingSpreadChanged
//     },
//     dispatch
//   );

const mapStatesToProps = state => {
  const { spreadPercentage, balanceRatio, balancingAggressionFactor, avgPrice, manualAggressionFactor, botStartedSuccessfully, 
    currentStrategy, currentStrategyCode, manualEthAmount, 
    manualDaiAmount, current_ask,
    current_bid } =
    state.TradeCardData || {};
  const { etherBalance, daiBalance } = state.PollFactoryReducer || {}
  return {
    spreadPercentage,
    balanceRatio,
    balancingAggressionFactor,
    avgPrice,
    manualAggressionFactor,
    etherBalance,
    daiBalance,
    botStartedSuccessfully,
    currentStrategy,
    currentStrategyCode,
    manualEthAmount,
    manualDaiAmount,
    current_ask,
    current_bid
  };
};

const myConnector = connect(mapStatesToProps);
const MarketMakingConnected = myConnector(MarketMaking);
const DAIRatioConnected = myConnector(DAIRatio);
const ManualDataConnected = myConnector(ManualData);

export default withStyles(styles)(connect(mapStatesToProps)(TradeCard));
