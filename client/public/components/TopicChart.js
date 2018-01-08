import React from 'react';
// import styles from '../css/app.css';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import TopicList from './TopicList';

class TopicChart extends React.Component {
  constructor(props){
    super(props);
  }

  componentWillReceiveProps(nextProps){

  }

  render(){
    return (
      <div>
        Topic Chart
        <TopicList />
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

export default connect(mapStateToProps, mapDispatchToProps)(TopicChart);
