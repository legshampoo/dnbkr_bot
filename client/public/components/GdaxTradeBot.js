import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  NavLink
} from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import FlatButton from 'material-ui/FlatButton';

// import styles from '../css/app.css';
import {
  joinRoom
} from '../actions/topicActions';

import {
  cancelAllOrders,
  executeMarketBuy,
  executeMarketSell
} from '../actions/marketActions';

class GdaxTradeBot extends React.Component {
  constructor(props){
    super(props);

    this.renderBotStatus = this.renderBotStatus.bind(this);
    this.renderMarketData = this.renderMarketData.bind(this);
    this.renderAccounts = this.renderAccounts.bind(this);
    this.handleOnClick = this.handleOnClick.bind(this);

  }

  componentDidMount(){
    console.log('attempting to join btc room');
    this.props.joinRoom('market_feed');
  }

  handleOnClick(e){
    // console.log(e);
    console.log(e.currentTarget.value);
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

      default:
        return
    }
  }

  renderControls(){
    return (
      <div key='controls_key'>
        renderControls
        <FlatButton
          key='cancel_all_orders'
          label='Cancel All Orders'
          value='cancel_all_orders'
          onClick={this.handleOnClick} />
        <FlatButton
          key='execute_market_buy'
          label='Market Buy'
          value='execute_market_buy'
          onClick={this.handleOnClick} />
        <FlatButton
          key='execute_market_sell'
          label='Market Sell'
          value='execute_market_sell'
          onClick={this.handleOnClick} />
      </div>
    )
  }

  renderAccounts(){
    // console.log('render acccounts');
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
        <div key={account.currency}>
          <br />
          currency: {account.currency}<br />
          id: {account.id}<br />
          balance: {account.balance}<br />
          available: {account.available}<br />
          hold: {account.hold}<br />
          profile_id: {account.profile_id}<br />
          <br />
        </div>
      );

      contents.push(content);
    })

    return (
      <div>
        {contents}
      </div>
    )
  }

  renderMarketData(){
    if(this.props.market === undefined){
      console.log('market data undefined');
      return (
        <div>
          waiting for market data...
        </div>
      )
    }

    return (
      <div>
        Market Data:<br />
        Exchange: {this.props.market.exchange}<br />
        Trading Pair: {this.props.market.pair}<br />
        Current Price: {this.props.market.price}<br />
      </div>
    )
  }

  renderBotStatus(){
      if(this.props.market.bot_status === undefined){
        console.log('bot has no status');
        return (
          <div>
            bot appears to be offline (undefined props)...
          </div>
        )
      }

      return (
        <div>
          Bot Status:<br />
          Communication: {this.props.market.bot_status.status} <br />
          Time: {this.props.market.bot_status.time} <br />
          Exchange: {this.props.market.bot_status.exchange} <br />
          Trading Pair: {this.props.market.bot_status.pair} <br />
        </div>
      )
  }

  render(){


    return (
      <div>
        {this.renderControls()}
        {this.renderMarketData()}
        {this.renderBotStatus()}
        {this.renderAccounts()}
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
