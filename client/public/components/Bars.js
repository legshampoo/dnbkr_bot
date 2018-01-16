import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { scaleLinear } from 'd3-scale';
import { interpolateLab } from 'd3-interpolate';

class Bars extends React.Component {
  constructor(props){
    super(props);

  }

  render(){
    const { scales, margins, bins, svgDimensions, chart } = this.props;
    const { xScale, yScale } = scales;
    const { height } = svgDimensions;


    const bars = (
      bins.map(datum =>
        //datum.length is the topic volume
        <rect
          key={datum.x0}
          x={xScale(datum.x0)}
          y={yScale(datum.length)}
          height={height - margins.bottom - scales.yScale(datum.length)}
          width={chart.barWidth}
          fill={chart.barColor}
        />
      )
    )

    return (
      <g>{bars}</g>
    )
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

export default connect(mapStateToProps, mapDispatchToProps)(Bars);
