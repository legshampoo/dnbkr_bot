import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import {
  scaleBand,
  scaleLinear
} from 'd3';

import Axis from './Axis';

class Axes extends React.Component {
  constructor(props){
    super(props);

    const { height, width } = this.props.svgDimensions;

    const margins = this.props.margins;
    const scales = this.props.scales;

    this.xProps = {
      orient: 'Bottom',
      scale: scales.xScale,
      translate: `translate(0, ${height - margins.bottom})`,
      tickSize: height - margins.top - margins.bottom
    }

    this.yProps = {
      orient: 'Left',
      scale: scales.yScale,
      translate: `translate(${margins.left}, 0)`,
      tickSize: width - margins.left - margins.right
    }

  }

  componentDidMount(){

  }

  componentDidUpdate(){

  }

  componentWillReceiveProps(nextProps){

  }

  render(){
    return (
      <g>
        <Axis {...this.xProps} />
        <Axis {...this.yProps} />
      </g>)
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

export default connect(mapStateToProps, mapDispatchToProps)(Axes);
