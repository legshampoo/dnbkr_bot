import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

const _ = require('lodash');
const moment = require('moment');

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';

import styles from '../css/app.css';

class MacdLineChart extends Component {
  constructor(props){
    super(props);

    this.renderChart = this.renderChart.bind(this);

    this.state = {
      zoom: 1
    }
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

  renderChart(){

    if(this.props.market.macd === undefined){
      return (
        <div>
          waiting on macd
        </div>
      )
    }

    var data = this.props.market.macd;

    return (
      <LineChart
        width={700}
        height={400}
        data={data} >
      <XAxis
        dataKey={'time'}
      />
      <YAxis />
      <Line
        type='monotone'
        dataKey='MACD'
        stroke='#00A1F7'
        dot={false}
      />
      <Line
        type='monotone'
        dataKey='signal'
        stroke='#FF64D7'
        dot={false} />
    </LineChart>
    )
  }


  render(){
    return (
      <div className={styles.chart}>
        MACD
        {this.renderChart()}
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
export default connect(mapStateToProps, mapDispatchToProps)(MacdLineChart);
