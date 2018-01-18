import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

const _ = require('lodash');
const moment = require('moment');

import {
  LineChart,
  Line
} from 'recharts';

import AxisBottom from './AxisBottom';
import AxisLeft from './AxisLeft';
// import MacdBars2 from './MacdBars2';

import ResponsiveWrapper from './ResponsiveWrapper';


class LineChartTest extends Component {
  constructor(props){
    super(props);

    this.renderChart = this.renderChart.bind(this);

  }

  componentDidMount(){

  }

  componentWillMount(){

  }

  componentWillReceiveProps(nextProps){
    if(this.props != nextProps){
      this.props = nextProps;

    }
  }

  renderChart(){

    var data = [
      {
        histogram: -10
      },
      {
        histogram: -4
      },
      {
        histogram: 5
      },
    ]

    return (
      <LineChart
        width={600}
        height={400}
        data={data} >
      <Line
        type='monotone'
        dataKey='histogram'
        stroke='#8884d8' />
    </LineChart>
    )
  }


  render(){
    return (
      <div>
        {this.renderChart()}
      </div>)
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    user: state.user,
    market: state.market
  }
}

const mapDispatchToProps = dispatch => {
  return {
    // userRegister: bindActionCreators(userRegister, dispatch)
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(LineChartTest);
// export default connect(mapStateToProps, mapDispatchToProps)(ResponsiveWrapper(LineChart));
