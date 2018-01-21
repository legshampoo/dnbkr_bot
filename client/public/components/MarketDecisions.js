import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

const _ = require('lodash');
const moment = require('moment');

import {
  BarChart,
  Bar,
  Brush,
  ReferenceLine,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';

import ResponsiveWrapper from './ResponsiveWrapper';

import styles from '../css/app.css';

class MarketDecisions extends Component {
  constructor(props){
    super(props);

    this.renderData = this.renderData.bind(this);
    this.renderMarketData = this.renderMarketData.bind(this);
    this.renderBotStatus = this.renderBotStatus.bind(this);

  }

  componentDidMount(){

  }

  componentWillMount(){

  }

  componentWillReceiveProps(nextProps){
    if(this.props != nextProps){
      this.props = nextProps;

    }
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
      <div className={styles.marketData}>
        Market Data:<br />
        Exchange: {this.props.market.exchange}<br />
        Trading Pair: {this.props.market.pair}<br />
        Current Price: {this.props.market.price}<br />
      </div>
    )
  }

  renderBotStatus(){
    if(this.props.market.bot_status === undefined){
      return (
        <div>
          no decision data
        </div>
      )
    }

    var status = this.props.market.bot_status;

    return (
      <div>
        Bot Status:<br />
        Communication: {status.status} <br />
        Time: {status.time} <br />
        Exchange: {status.exchange} <br />
        Trading Pair: {status.pair} <br />
      </div>
    )
  }

  renderData(){
    if(this.props.market.marketDecisions === undefined){
      return (
        <div>
          no decision data
        </div>
      )
    }

    var data = this.props.market.marketDecisions;

    var trade_decision = data.trade_decision;
    var trend = data.trend;
    var time = data.time;
    var decisionPrice = data.currentPrice;


    return (
      <div>
        Bot Action:
        Time: {time} <br />
        Price: {decisionPrice} <br />
        Market Trend: {trend} <br />
        BOT DECISION: {trade_decision} <br />
        <br />
      </div>
    )
  }

  render(){

    return (
      <div className={styles.marketDecisions}>
        Data:
        {this.renderData()} <br />
        Bot Status:
        {this.renderBotStatus()} <br />
        Market Data:
        {this.renderMarketData()} <br />
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
    // userRegister: bindActionCreators(userRegister, dispatch)
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(MarketDecisions);
// export default connect(mapStateToProps, mapDispatchToProps)(ResponsiveWrapper(LineChart));
