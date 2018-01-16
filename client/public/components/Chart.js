import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

const _ = require('lodash');
const moment = require('moment');
import {
  scaleBand,
  scaleLinear
} from 'd3-scale';

import * as d3 from 'd3';

import styles from '../css/app.css';

import Axes from './Axes';
import Bars from './Bars';

import ResponsiveWrapper from './ResponsiveWrapper';


class Chart extends Component {
  constructor(props){
    super(props);

    this.renderChart = this.renderChart.bind(this);
    this.prepData = this.prepData.bind(this);
    this.setTimeInterval = this.setTimeInterval.bind(this);
  }

  componentDidMount(){
    this.renderChart();
  }

  componentWillMount(){
    // this.renderChart();
  }

  componentWillReceiveProps(nextProps){
    if(this.props != nextProps){
      this.props = nextProps;
      this.renderChart();
    }
  }

  setTimeInterval(){
    switch(this.props.timeInterval){
      case 'minute':
        console.log('its a minute');
        return d3.timeMinute;
        break;
      case 'hour':
        console.log('hourz');
        return d3.timeHour;
        break;
      case 'day':
        console.log('dayz');
        return d3.timeDay;
        break;
      case 'week':
        console.log('week');
        return d3.timeWeek;
        break;
      default:
        console.log('default');
        return d3.timeDay;
        break;
    }
  }

  prepData(){

    if(this.props.topics.topic === undefined){
      console.log('no topic data yet');
      return (
        <div>
          no topic selected yo
        </div>
      )
    }

    const topic = this.props.topics.topic;
    const historicalData = topic.historicalData;

    var map = historicalData.map((item) => {
      return new Date(item.time_utc);
    });

    return map;
  }


  renderChart(){

    if(this.props.topics.topic === undefined){
      console.log('no topic data yet');
      return (
        <div>
          no topic selected
        </div>
      )
    }

    var data = this.prepData();

    const topic = this.props.topics.topic;
    const historicalData = topic.historicalData;

    if(data === undefined){
      console.log('Data not in redux store...');
      return
    }

    var timeInterval = this.setTimeInterval();

    var params = {
      timeIntervals: timeInterval,
      svgDimensions: {
        width: Math.max(this.props.parentWidth, 400),
        height: 500
      },
      margins: {
        bottom: 100,
        left: 60,
        right: 20,
        top: 10
      },
      chart: {
        padding: {
          top: 10
        },
        barWidth: 1,
        barColor: '#848484',
        yAxisTicks: 7
      }
    }

    var minDate = new Date(2018, 0, 11);
    var maxDate = Date.now();
    var rangeStart = params.margins.left;
    var rangeEnd = params.svgDimensions.width - params.margins.right;

    const xScale = d3.scaleTime()
      .domain([minDate, maxDate])
      .range([rangeStart, rangeEnd]);

    var histogram = d3.histogram()
      .value(function(d) { return d })
      .domain(xScale.domain())
      .thresholds(xScale.ticks(params.timeIntervals));

    var bins = histogram(data);
    var barWidth = (rangeEnd - rangeStart) / bins.length;
    params.chart.barWidth = barWidth;
    var values = [];
    bins.forEach(bin => {
      values.push(bin.length);
    });

    const maxVolume = d3.max(values);
    const yScaleMax = maxVolume + (maxVolume * .1); //add 10% margin at top

    var yScale = d3.scaleLinear()
      .domain([0, yScaleMax])
      .range([params.svgDimensions.height - params.margins.bottom, params.margins.top]);

    const maxValue = Math.max(...bins.map(d => d.length)) + params.chart.padding.top;

    return(
      <svg
        width={params.svgDimensions.width}
        height={params.svgDimensions.height}>
          <Axes
            params={params}
            scales={{ xScale, yScale }}
            bins={bins}
            />
          <Bars
            scales={{ xScale, yScale }}
            margins={params.margins}
            bins={bins}
            maxValue={maxValue}
            svgDimensions={params.svgDimensions}
            chart={params.chart} />
        </svg>
    )
  }

  render(){
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
