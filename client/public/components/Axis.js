import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as d3Axis from 'd3-axis';
import {
  select as d3Select
} from 'd3-selection';

class Axis extends Component {
  constructor(props){
    super(props);

  }

  componentDidMount(){
    this.renderAxis();
  }

  componentDidUpdate(){
    this.renderAxis();
  }

  componentWillReceiveProps(nextProps){

  }

  renderAxis(){
    const axisType = `axis${this.props.orient}`
    const axis = d3Axis[axisType]()
      .scale(this.props.scale)
      .tickSize(-this.props.tickSize)
      .tickPadding([12])
      .ticks([4]);

    d3Select(this.axisElement).call(axis);
  }

  render(){
    return (
      <g
        className={`Axis Axis-${this.props.orient}`}
        ref={(el) => { this.axisElement = el; }}
        transform={this.props.translate}
      />)
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

export default connect(mapStateToProps, mapDispatchToProps)(Axis);
