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
      <div className={styles.marketDecisions}>
        BOT DECISION: {trade_decision} <br />
        Market Trend: {trend} <br />
        At: {time} <br />
        Price: {decisionPrice}
      </div>
    )
  }

  render(){

    return (
      <div>
        {this.renderData()}
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
