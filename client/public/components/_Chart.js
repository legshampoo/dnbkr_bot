// import React, { Component } from 'react';
// import { bindActionCreators } from 'redux';
// import { connect } from 'react-redux';
//
// import styles from '../css/app.css';
//
// import Axes from './Axes';
// import Bars from './Bars';
//
// import ResponsiveWrapper from './ResponsiveWrapper';
//
// import {
//   scaleBand,
//   scaleLinear
// } from 'd3-scale';
//
// class Chart extends Component {
//   constructor(props){
//     super(props);
//
//     this.xScale = scaleBand();
//     this.yScale = scaleLinear();
//
//     this.data = [
//       { title: 'Terminator', value: 21, year: 1984 },
//       { title: 'Commando', value: 81, year: 1985 },
//       { title: 'Predator', value: 25, year: 1987 },
//       { title: 'Raw Deal', value: 26, year: 1986 },
//       { title: 'The Running Man', value: 11, year: 1987 },
//       { title: 'Total Recall', value: 44, year: 1990 },
//       { title: 'Terminator 2', value: 0, year: 1991 },
//       { title: 'Last Action Hero', value: 22, year: 1993 },
//       { title: 'True Lies', value: 51, year: 1994 },
//       { title: 'Eraser', value: 29, year: 1996 },
//       { title: 'Terminatorx 3', value: 2, year: 2003 },
//       { title: 'Terminatorv', value: 1001, year: 1984 },
//       { title: 'Commandos', value: 81, year: 1985 },
//       { title: 'Prevdator', value: 25, year: 1987 },
//       { title: 'Rawsa Deal', value: 26, year: 1986 },
//       { title: 'The Rswunning Man', value: 11, year: 1987 },
//       { title: 'Total bbbRecall', value: 44, year: 1990 },
//       { title: 'Termiddnator 2', value: 0, year: 1991 },
//       { title: 'Last ssssAction Hero', value: 22, year: 1993 },
//       { title: 'True Lgggies', value: 51, year: 1994 },
//       { title: 'Erasrrger', value: 29, year: 1996 },
//       { title: 'Termidgdnator 3', value: 2, year: 2003 },
//       { title: 'Terminsdgsdator', value: 21, year: 1984 },
//       { title: 'Commansdgdo', value: 81, year: 1985 },
//       { title: 'Presdator', value: 25, year: 1987 },
//       { title: 'Raws Deal', value: 26, year: 1986 },
//       { title: 'The sdRunning Man', value: 11, year: 1987 },
//       { title: 'Total dgRecall', value: 44, year: 1990 },
//       { title: 'Terminatdsor 2', value: 0, year: 1991 },
//       { title: 'Last Actiodsn Hero', value: 22, year: 1993 },
//       { title: 'Tdsrue Lies', value: 51, year: 1994 },
//       { title: 'Eravdfser', value: 29, year: 1996 },
//       { title: 'Termidsfnator 3', value: 2, year: 2003 },
//       { title: 'Termindgator', value: 21, year: 1984 },
//     ]
//   }
//
//   render(){
//
//     var margins = {
//       bottom: 100,
//       left: 60,
//       right: 20,
//       top: 50
//     }
//
//     const svgDimensions = {
//       width: Math.max(this.props.parentWidth, 400),
//       height: 500
//     }
//
//     const maxValue = Math.max(...this.data.map(d => d.value));
//
//     const xScale = this.xScale
//       .padding(0.5)
//       .domain(this.data.map(d => d.title))
//       .range([margins.left, svgDimensions.width - margins.right]);
//
//     const yScale = this.yScale
//       .domain([0, maxValue])
//       .range([svgDimensions.height - margins.bottom, margins.top]);
//
//
//     return (
//       <div className={styles.chart}>
//         <svg
//           width={svgDimensions.width}
//           height={svgDimensions.height}>
//             <Axes
//               scales={{ xScale, yScale }}
//               margins={margins}
//               svgDimensions={svgDimensions} />
//             <Bars
//               scales={{ xScale, yScale }}
//               margins={margins}
//               data={this.data}
//               maxValue={maxValue}
//               svgDimensions={svgDimensions} />
//           </svg>
//       </div>)
//   }
// }
//
// const mapStateToProps = (state, ownProps) => {
//   return {
//     user: state.user
//   }
// }
//
// const mapDispatchToProps = dispatch => {
//   return {
//     // userRegister: bindActionCreators(userRegister, dispatch)
//   }
// }
//
// export default connect(mapStateToProps, mapDispatchToProps)(ResponsiveWrapper(Chart));
// // const ChartConnected = connect(mapStateToProps, mapDispatchToProps)(Chart);
//
// // export default ResponsiveWrapper(Chart);
