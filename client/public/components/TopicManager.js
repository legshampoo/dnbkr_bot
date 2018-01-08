import React from 'react';
// import styles from '../css/app.css';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import AddTopicForm from './AddTopicForm';
import TopicList from './TopicList';

class TopicManager extends React.Component {
  constructor(props){
    super(props);
  }

  componentWillReceiveProps(nextProps){

  }

  render(){
    return (
      <div>
        <AddTopicForm />
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

export default connect(mapStateToProps, mapDispatchToProps)(TopicManager);
