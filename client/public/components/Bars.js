import React from 'react';
// import styles from '../css/app.css';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { scaleLinear } from 'd3-scale';
import { interpolateLab } from 'd3-interpolate';

class Bars extends React.Component {
  constructor(props){
    super(props);

    this.colorScale = scaleLinear()
      .domain([0, this.props.maxValue])
      .range(['#F3E55F5', '#7B1FA2'])
      .interpolate(interpolateLab)
  }

  render(){
    const { scales, margins, data, svgDimensions } = this.props;
    const { xScale, yScale } = scales;
    const { height } = svgDimensions;

    const bars = (
      data.map(datum =>
        <rect
          key={datum.title}
          x={xScale(datum.title)}
          y={yScale(datum.value)}
          height={height - margins.bottom - scales.yScale(datum.value)}
          width={xScale.bandwidth()}
          fill={this.colorScale(datum.value)}
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
    user: state.user
  }
}

const mapDispatchToProps = dispatch => {
  return {
    // userRegister: bindActionCreators(userRegister, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Bars);
