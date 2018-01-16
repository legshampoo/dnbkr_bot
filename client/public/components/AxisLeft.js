import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as d3 from 'd3';

class Axis extends Component {
  constructor(props){
    super(props);

    this.renderAxis = this.renderAxis.bind(this);

  }

  componentDidMount(){
    this.renderAxis();
  }

  componentWillReceiveProps(nextProps){
    if(this.props != nextProps){
      this.props = nextProps;
      this.renderAxis();
    }
  }

  renderAxis(){
    const { scale } = this.props;

    var axis = d3.axisLeft()
      .scale(scale)
      .ticks(this.props.ticks)
      .tickSize(-this.props.tickSize);

    const svg = d3.select(this.axisElement);

    svg.call(axis);
  }

  render(){
    return (
      <g
        ref={(el) => { this.axisElement = el; }}
        transform={this.props.translate}
      />)
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

export default connect(mapStateToProps, mapDispatchToProps)(Axis);
