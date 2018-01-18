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

import AxisBottom from './AxisBottom';
import AxisLeft from './AxisLeft';
import styles from '../css/app.css';

class MacdHistogram extends Component {
  constructor(props){
    super(props);

    this.renderChart = this.renderChart.bind(this);

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
    data = data.slice(-30);

    var histogram = [...data.map(o => o.histogram)];

    var min = Math.min(...histogram);
    var max = Math.max(...histogram);

    return (
      <BarChart
        width={800}
        height={600}
        data={data}
        margin={{top: 5, right: 30, left: 20, bottom: 5}} >
        <XAxis
          dataKey='time'
        />
        <YAxis
          type={'number'}
          name={'histogram'}
          // domain={['dataMin', 'dataMax']}
          // domain={[min, max]}
        />
        <Bar
          dataKey='histogram'
          fill='#8884d8' />
        <ReferenceLine
          y={0}
          stroke='#000' />
      </BarChart>
    )
  }


  render(){
    return (
      <div className={styles.chart}>
        MACD Histogram
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
export default connect(mapStateToProps, mapDispatchToProps)(MacdHistogram);
