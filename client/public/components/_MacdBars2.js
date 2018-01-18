// import React from 'react';
// import { bindActionCreators } from 'redux';
// import { connect } from 'react-redux';
//
// import { scaleLinear } from 'd3-scale';
// import { interpolateLab } from 'd3-interpolate';
//
// class MacdBars2 extends React.Component {
//   constructor(props){
//     super(props);
//
//   }
//
//   renderBars(){
//     if(this.props.histogram === undefined){
//       return
//     }
//     var xScale = this.props.xScale;
//     var yScale = this.props.yScale;
//     var params = this.props.params;
//
//     var histogram = this.props.histogram;
//     histogram = histogram.reverse();
//     var contents = [];
//
//
//     var transform = {
//       // translate: `translate(0, ${ yScale(0) })`
//       translate: `translate(0, ${ yScale(0) })`
//     }
//
//     console.log(histogram);
//     histogram.forEach((value, index) => {
//       var offset = 0;
//       var height = 0;
//
//       if(value > 0){
//         // height = yScale(value);
//         height = yScale(value);
//         // height = params.svgDimensions.height - params.margins.bottom - yScale(value);
//         offset = -yScale(value);
//
//       }else{
//         height = yScale(Math.abs(value));
//         offset -= yScale(Math.abs(value));
//         offset -= offset;
//       }
//
//       var bar = (
//         <rect
//           key={index}
//           x={xScale(index)}
//           y={offset}
//           height={height}
//           width={10}
//           fill='#848484'
//           transform={transform.translate}
//         />
//       )
//
//       contents.push(bar);
//
//     })
//
//     return (
//       <g>
//         {contents}
//       </g>
//     )
//   }
//
//   render(){
//
//
//     return (
//       <g>
//         {this.renderBars()}
//       </g>
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
// export default connect(mapStateToProps, mapDispatchToProps)(MacdBars2);
