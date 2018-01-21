import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  NavLink
} from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';

import {
  joinRoom
} from '../actions/topicActions';

import {
  cancelAllOrders,
  executeMarketBuy,
  executeMarketSell
} from '../actions/marketActions';

import {
  Toolbar,
  ToolbarGroup,
  ToolbarSeparator,
  ToolbarTitle
} from 'material-ui/Toolbar';

// import MacdChart from './MacdChart';
import LineChartTest from './LineChartTest';
import MacdHistogram from './MacdHistogram';
import MacdLineChart from './MacdLineChart';
import HistoricalLineChart from './HistoricalLineChart';
import MarketDecisions from './MarketDecisions';

import styles from '../css/app.css';

class GdaxTradeBot extends React.Component {
  constructor(props){
    super(props);

    // this.renderBotStatus = this.renderBotStatus.bind(this);
    // this.renderMarketData = this.renderMarketData.bind(this);
    this.renderAccounts = this.renderAccounts.bind(this);
    this.handleOnClick = this.handleOnClick.bind(this);

  }

  componentDidMount(){

    this.props.joinRoom('market_feed');
  }

  handleOnClick(e){
    const command = e.currentTarget.value;

    switch(command){
      case 'cancel_all_orders':
        this.props.cancelAllOrders();
        return

      case 'execute_market_buy':
        this.props.executeMarketBuy();
        return

      case 'execute_market_sell':
        this.props.executeMarketSell();
        return

      case 'halt_trading':
        console.log('halt trading here');
        // this.props.executeMarketSell();
        return

      case 'resume_trading':
        console.log('resume trading here');
        // this.props.executeMarketSell();
        return

      default:
        return
    }
  }

  renderControls(){
    return (
      <Toolbar>
        <ToolbarGroup>
          <ToolbarTitle text='GDAX Trade Bot' />
            <RaisedButton
              key='halt_trading'
              label='Halt Trading'
              value='halt_trading'
              onClick={this.handleOnClick} />
            <RaisedButton
              key='resume_trading'
              label='Resume Trading'
              value='resume_trading'
              onClick={this.handleOnClick} />
            <RaisedButton
              key='cancel_all_orders'
              label='Cancel Orders'
              value='cancel_all_orders'
              onClick={this.handleOnClick} />
            <RaisedButton
              key='execute_market_buy'
              label='Market Buy'
              value='execute_market_buy'
              onClick={this.handleOnClick} />
            <RaisedButton
              key='execute_market_sell'
              label='Market Sell'
              value='execute_market_sell'
              onClick={this.handleOnClick} />
          <ToolbarTitle text={`Price: $ ${this.props.market.price}`}/>
        </ToolbarGroup>
      </Toolbar>
    )
  }

  renderAccounts(){
    if(this.props.market.accounts === undefined){
      return (
        <div>
          waiting for account info...
        </div>
      )
    }

    var accounts = this.props.market.accounts;
    var contents = [];

    Object.keys(accounts).forEach((item, key) => {
      var account = accounts[item];

      const content = (
        <div
          // className={styles.accountData}
          key={account.currency}>
          <br />
          currency: {account.currency}<br />
          id: {account.id}<br />
          balance: {account.balance}<br />
          available: {account.available}<br />
          hold: {account.hold}<br />
          profile_id: {account.profile_id}<br />
          {/* <br /> */}
        </div>
      );

      contents.push(content);
    })

    return (
      <div className={styles.accountData}>
        Accounts:
        {contents}
      </div>
    )
  }

  render(){


    return (
      <div>
        {this.renderControls()}
        <div className={styles.tradeBotDashboard}>
          <MacdHistogram />
          <MarketDecisions />
          <HistoricalLineChart />
          <MacdLineChart />
          {this.renderAccounts()}
        </div>
      </div>)
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    user: state.user,
    market: state.market
  }
}

const mapDispatchToProps = dispatch => {
  return {
    joinRoom: bindActionCreators(joinRoom, dispatch),
    cancelAllOrders: bindActionCreators(cancelAllOrders, dispatch),
    executeMarketBuy: bindActionCreators(executeMarketBuy, dispatch),
    executeMarketSell: bindActionCreators(executeMarketSell, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(GdaxTradeBot);
