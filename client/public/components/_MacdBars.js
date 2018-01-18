// import React from 'react';
// import { bindActionCreators } from 'redux';
// import { connect } from 'react-redux';
//
// import { scaleLinear } from 'd3-scale';
// import { interpolateLab } from 'd3-interpolate';
//
// class Bars extends React.Component {
//   constructor(props){
//     super(props);
//
//   }
//
//   render(){
//     const { margins, bins, svgDimensions } = this.props;
//
//     const xScale = this.props.xScale;
//     const yScale = this.props.yScale;
//     const { height } = svgDimensions;
//
//     var contents = [];
//     bins.forEach((bin, index) => {
//
//       // console.log(bin);
//       if(bin === undefined || bin === NaN){
//         bin = 0;
//       }
//
//       var translate = {
//         // translate: `translate(0, 0)`
//         // translate: `translate(0, ${(height - margins.top - margins.bottom) / 2})`
//         // translate: `translate(0, ${yScale(0)})`
//         // translate: `translate(0, ${height - margins.bottom - yScale(10)})`
//         translate: `translate(0, ${0})`
//       }
//       // var barHeight = 10;
//       var barHeight = 0;
//       if(bin > 0){
//         barHeight = yScale(0);
//         // barHeight = 10;
//         // console.log(bin)
//       }else{
//         // barHeight = yScale(bin) - (yScale(bin));
//         barHeight = 0;
//         // console.log(yScale(bin));
//       }
//       var bar = (
//         <rect
//           key={index}
//           x={xScale(index)}
//           // y={yScale(bin)}
//           y={yScale(0) - barHeight}
//           // y={0}
//           // y={yScale(0) - barHeight}
//           // height={height - margins.bottom - yScale(0)}
//           // height={Math.abs(yScale(bin) - yScale(0))}
//           // height={yScale(Math.abs(bin)) - yScale(0)}
//           // height={yScale(bin) - yScale(0)}
//           // height={barHeight}
//           height={barHeight}
//           width={1}
//           fill='#848484'
//           transform={translate.translate}
//         />
//       )
//
//       contents.push(bar);
//     })
//
//     return (
//       <g>{contents}</g>
//     )
//   }
// }
//
// const mapStateToProps = (state, ownProps) => {
//   return {
//     user: state.user
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
// export default connect(mapStateToProps, mapDispatchToProps)(Bars);
