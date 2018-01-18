// import React, { Component } from 'react';
// import { bindActionCreators } from 'redux';
// import { connect } from 'react-redux';
//
// const _ = require('lodash');
// const moment = require('moment');
// import {
//   scaleBand,
//   scaleLinear
// } from 'd3-scale';
//
// import * as d3 from 'd3';
//
// // import styles from '../css/app.css';
//
// // import Axes from './Axes';
// // import Bars from './Bars';
// import AxisBottom from './AxisBottom';
// import AxisLeft from './AxisLeft';
// // import MacdBars from './MacdBars';
// import MacdBars2 from './MacdBars2';
//
// import ResponsiveWrapper from './ResponsiveWrapper';
//
//
// class MacdChart extends Component {
//   constructor(props){
//     super(props);
//
//     this.renderChart = this.renderChart.bind(this);
//
//   }
//
//   componentDidMount(){
//
//   }
//
//   componentWillMount(){
//
//   }
//
//   componentWillReceiveProps(nextProps){
//     if(this.props != nextProps){
//       this.props = nextProps;
//
//     }
//   }
//
//   renderChart(){
//
//     var data = [
//       -10, -9, -8, -7, -6, -5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10
//     ]
//
//     if(this.props.market.macd === undefined){
//       return(
//         <div>
//           no chart data yet
//         </div>
//       )
//     }
//
//     var macd = this.props.market.macd.macd;
//
//     var params = {
//       svgDimensions: {
//         width: Math.max(this.props.parentWidth, 400),
//         height: 300
//       },
//       margins: {
//         bottom: 100,
//         left: 60,
//         right: 20,
//         top: 10
//       },
//       yAxisTicks: 10
//     }
//
//     var histogram = [];
//     // Object.keys(macd).forEach((key, index) => {
//     //   histogram.push(macd[key].histogram);
//     // })
//
//     histogram = data;
//
//     const xScaleMin = histogram.length;
//     const xScaleMax = 0;
//     const rangeStart = params.margins.left;
//     const rangeEnd = params.svgDimensions.width - params.margins.right;
//
//     const xScale = d3.scaleLinear()
//       .domain([xScaleMin, xScaleMax])
//       .range([rangeStart, rangeEnd]);
//
//     // var yScaleMax = d3.max(histogram);
//     // var yScaleMin = d3.min(histogram);
//
//     // console.log(d3.extent(histogram));
//
//
//     const yScale = d3.scaleLinear()
//       .domain([-10, 10])
//       // .domain(d3.extent(histogram))
//       .range([params.svgDimensions.height - params.margins.bottom, params.margins.top])
//
//     var xProps = {
//       orient: 'Bottom',
//       scale: xScale,
//       translate: `translate(0, ${params.svgDimensions.height - params.margins.bottom})`,
//       tickSize: -3
//     }
//
//     var yProps = {
//       orient: 'Left',
//       scale: yScale,
//       translate: `translate(${params.margins.left}, 0)`,
//       // translate: `translate(0, 0)`,
//       tickSize: params.svgDimensions.width - params.margins.left - params.margins.right,
//       ticks: params.yAxisTicks
//     }
//
//     return (
//       <svg
//         width={params.svgDimensions.width}
//         height={params.svgDimensions.height}>
//         <AxisBottom {...xProps} />
//         <AxisLeft {...yProps} />
//         <MacdBars2
//           histogram={histogram}
//           xScale={xScale}
//           yScale={yScale}
//           params={params}
//         />
//       </svg>
//     )
//   }
//
//
//   render(){
//     return (
//       <div>
//         {this.renderChart()}
//       </div>)
//   }
// }
//
// const mapStateToProps = (state, ownProps) => {
//   return {
//     user: state.user,
//     market: state.market
//     // topics: state.topics
//   }
// }
//
// const mapDispatchToProps = dispatch => {
//   return {
//     // userRegister: bindActionCreators(userRegister, dispatch)
//   }
// }
//
// export default connect(mapStateToProps, mapDispatchToProps)(ResponsiveWrapper(MacdChart));
