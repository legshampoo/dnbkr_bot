import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

const _ = require('lodash');
const moment = require('moment');

import styles from '../css/app.css';

import Axes from './Axes';
import Bars from './Bars';

import ResponsiveWrapper from './ResponsiveWrapper';

import {
  scaleBand,
  scaleLinear
} from 'd3-scale';

import * as d3 from 'd3';

class Chart extends Component {
  constructor(props){
    super(props);

    this.renderChart = this.renderChart.bind(this);
    this.formatData = this.formatData.bind(this);

    this.xScale = scaleBand();
    this.yScale = scaleLinear();

  }

  componentDidMount(){

  }

  componentWillReceiveProps(nextProps){
    if(this.props != nextProps){
      this.props = nextProps;
    }
  }

  formatData(){
    console.log('formatting data');
    if(this.props.topics.topic === undefined){
      console.log('no topic data yet');
      return
    }

    const d = this.props.topics.topic;
    const dates = d.historicalData;

    const groups = _(dates)
      .groupBy(v => moment(v.time_utc).utc().format('HH'))
      .mapValues(v => _.map(v, 'time_utc'))
      .value();

    console.log('groups:');
    console.log(groups);

    var finalData = {};
    var finalData = [];

    Object.keys(groups).forEach((key, index) => {
      var groupTotal = 0;
      groups[key].forEach(item => {
        // console.log(item);
        groupTotal++;
      })
      // console.log('new group, total: ', groupTotal);
      console.log('MONGOTIME: ', groups[key][0]);
      var mongoTime = new Date(groups[key][0]);
      var formatTime = d3.timeFormat('%B %d %H:%M %p, %Y');
      var time_interval = formatTime(mongoTime);
      console.log('time_interval: ', time_interval);

      var entry = {
        // time: groups[key][0].time_utc,
        time: time_interval,
        volume: groupTotal
      }

      finalData.push(entry);
    });

    return finalData;
  }

  renderChart(){
    // var data = [
    //   { time: '1', volume: 10 },
    //   { time: '2', volume: 5 },
    //   { time: '3', volume: 6 },
    //   { time: '4', volume: 24 },
    //   { time: '5', volume: 12 },
    // ]
    var data = this.formatData();

    if(data === undefined){
      console.log('not ready yet');
      return
    }

    var margins = {
      bottom: 100,
      left: 60,
      right: 20,
      top: 50
    }

    const svgDimensions = {
      width: Math.max(this.props.parentWidth, 400),
      height: 500
    }

    const maxValue = Math.max(...data.map(d => d.volume));

    const xScale = this.xScale
      .padding(0.5)
      .domain(data.map(d => d.time))
      .range([margins.left, svgDimensions.width - margins.right]);

    const yScale = this.yScale
      .domain([0, maxValue])
      .range([svgDimensions.height - margins.bottom, margins.top]);

    return(
      <svg
        width={svgDimensions.width}
        height={svgDimensions.height}>
          <Axes
            scales={{ xScale, yScale }}
            margins={margins}
            svgDimensions={svgDimensions} />
          <Bars
            scales={{ xScale, yScale }}
            margins={margins}
            data={data}
            maxValue={maxValue}
            svgDimensions={svgDimensions} />
        </svg>
    )
  }

  render(){
    // const data = this.props.topics.topic;

    // var margins = {
    //   bottom: 100,
    //   left: 60,
    //   right: 20,
    //   top: 50
    // }
    //
    // const svgDimensions = {
    //   width: Math.max(this.props.parentWidth, 400),
    //   height: 500
    // }
    //
    // const maxValue = Math.max(...this.data.map(d => d.value));
    //
    // const xScale = this.xScale
    //   .padding(0.5)
    //   .domain(this.data.map(d => d.title))
    //   .range([margins.left, svgDimensions.width - margins.right]);
    //
    // const yScale = this.yScale
    //   .domain([0, maxValue])
    //   .range([svgDimensions.height - margins.bottom, margins.top]);


    return (
      <div className={styles.chart}>
        {this.renderChart()}
      </div>)
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    user: state.user,
    topics: state.topics
  }
}

const mapDispatchToProps = dispatch => {
  return {
    // userRegister: bindActionCreators(userRegister, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ResponsiveWrapper(Chart));
// const ChartConnected = connect(mapStateToProps, mapDispatchToProps)(Chart);

// export default ResponsiveWrapper(Chart);
