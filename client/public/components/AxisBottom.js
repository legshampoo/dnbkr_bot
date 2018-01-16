import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

// import * as d3Axis from 'd3-axis';
// import {
//   select as d3Select
// } from 'd3-selection';

import * as d3 from 'd3';

class Axis extends Component {
  constructor(props){
    super(props);

    this.renderAxis = this.renderAxis.bind(this);

  }

  componentDidMount(){
    this.renderAxis();
  }

  componentWillMount(){
    // this.renderAxis();
  }

  componentDidUpdate(){
    // this.renderAxis();
  }

  componentWillReceiveProps(nextProps){
    if(this.props != nextProps){
      this.props = nextProps;
      this.renderAxis();
    }
  }
  
  renderAxis(){
    if(this.props.topics === undefined){
      console.log('axis props undefined yall');
      return
    }

    var svg = d3.select(this.axisElement);

    var axis = d3.axisBottom()
      .scale(this.props.scale)
      .tickSize(-this.props.tickSize)
      .ticks(10);

    svg.call(axis);
  }

  render(){
    return (
      <g
        // className={`Axis Axis-${this.props.orient}`}
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
