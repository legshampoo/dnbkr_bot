import React from 'react';
// import styles from '../css/app.css';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';

import { getAllTopics } from '../actions/topicActions';

class TopicList extends React.Component {
  constructor(props){
    super(props);

    this.state = {

    }
  }

  componentWillMount(){
    this.props.getAllTopics();
  }

  componentWillReceiveProps(nextProps){
    if(this.props !== nextProps){
      this.props = nextProps;
    }
  }

  renderTopicList(){
    let topicList = this.props.topicList;

    if(topicList === undefined || topicList === null){
      console.log('undef')
      return
    }

    var content = [];

    Object.keys(topicList).map((key, index) => {
      let name = topicList[key].name;
      let count = topicList[key].count;

      let topic = (
        <div key={index}>
          {name} - {count}
        </div>
      )

      content.push(topic);
    })

    return(
      <div>
        {content}
      </div>
    )
  }

  render(){
    return (
      <div name='topic-list'>
        <h1>Topics</h1>
        {this.renderTopicList()}
      </div>)
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    user: state.user,
    topicList: state.topics.topicList
  }
}

const mapDispatchToProps = dispatch => {
  return {
    getAllTopics: bindActionCreators(getAllTopics, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(TopicList);
