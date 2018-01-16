import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

// import Axis from './Axis';
import AxisBottom from './AxisBottom';
import AxisLeft from './AxisLeft';

class Axes extends React.Component {
  constructor(props){
    super(props);

  }

  componentDidMount(){

  }

  componentWillReceiveProps(nextProps){
    if(this.props != nextProps){
      this.props = nextProps;
    }
  }

  renderAxes(){
    const { scales, params, bins } = this.props;

    const width = params.svgDimensions.width;
    const height = params.svgDimensions.height;
    const margins = params.margins;

    this.xProps = {
      orient: 'Bottom',
      scale: scales.xScale,
      translate: `translate(0, ${height - margins.bottom})`,
      tickSize: -3,
      bins: bins
    }

    this.yProps = {
      orient: 'Left',
      scale: scales.yScale,
      translate: `translate(${margins.left}, 0)`,
      tickSize: width - margins.left - margins.right,
      ticks: params.chart.yAxisTicks
    }

    return (
      <g>
        <AxisLeft {...this.yProps} />
        <AxisBottom {...this.xProps} />
      </g>)
  }

  render(){
    // let props = this.props;

    return (
      <g>
        {this.renderAxes()}
      </g>)
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

  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Axes);
