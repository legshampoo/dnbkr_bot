import React from 'react';
// import styles from '../css/app.css';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import TopicList from './TopicList';
import Chart from './Chart';

import styles from '../css/app.css';

class ChartDashboard extends React.Component {
  constructor(props){
    super(props);
  }

  componentWillReceiveProps(nextProps){

  }

  render(){
    return (
      <div>
        Topic Chart
        <div className={styles.chartDashboard}>
          <TopicList />
          <div className={styles.responsiveContainer}>
            <Chart />
          </div>
        </div>
      </div>)
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

export default connect(mapStateToProps, mapDispatchToProps)(ChartDashboard);
