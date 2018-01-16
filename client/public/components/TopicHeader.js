import React from 'react';
import { NavLink } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

class TopicHeader extends React.Component {
  constructor(props){
    super(props);

  }

  render(){
    console.log(this.props.topics.topic.name);

    return (
      <div>
        {this.props.topics.topic.name}
      </div>)
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    topics: state.topics
  }
}

const mapDispatchToProps = dispatch => {
  return {
    // userLogin: bindActionCreators(userLogin, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(TopicHeader);
