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

class HistoricalLineChart extends Component {
  constructor(props){
    super(props);

    this.renderChart = this.renderChart.bind(this);

    this.state = {
      zoom: 1,
      historicalData: []
    }
  }

  componentDidMount(){

  }

  componentWillMount(){

  }

  componentWillReceiveProps(nextProps){
    if(this.props != nextProps){
      this.props = nextProps;
      if(this.props.market.historicalData === undefined){
        return
      }

      var data = this.props.market.historicalData;


      this.setState({
        historicalData: data
      })
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

    // var data = this.props.market.historicalData;
    var data = this.state.historicalData;

    data = data.slice(-12);

    // console.log('Max: ', Math.max(data.close));
    // console.log('Min: ', Math.min(data.close));
    var max = Math.max(...data.map(o => o.close));
    var min = Math.min(...data.map(o => o.close));
    // console.log('MAX: ', max);
    // console.log('MIN: ', min);

    return (
      <LineChart
        width={800}
        height={600}
        data={data}
        margin={{top: 10, right: 30, left: 20, bottom: 10}} >
      <XAxis
        // label={'Time'}
        dataKey={'time'} />
      <YAxis
        type={'number'}
        // label={'Close'}
        name={'USD'}
        // domain={['dataMin', 'dataMax']}
        domain={[min - 100, max - 100]}
        scale={'linear'} />
      <CartesianGrid
        strokeDasharray='3 3' />
      <Line
        type='monotone'
        dataKey='close'
        stroke='#8884d8' />
    </LineChart>
    )
  }


  render(){
    return (
      <div className={styles.chart}>
        Close Price
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

export default connect(mapStateToProps, mapDispatchToProps)(HistoricalLineChart);
