import React from 'react';
// import styles from '../css/app.css';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import { List, ListItem } from 'material-ui/List';

import { getAllTopics } from '../actions/topicActions';

import styles from '../css/app.css';

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
      return
    }

    var content = [];

    Object.keys(topicList).map((key, index) => {
      let name = topicList[key].name;
      let count = topicList[key].count;

      let topic = (
        <ListItem
          key={index}
          primaryText={name}>
        </ListItem>
      )

      content.push(topic);
    })

    return(
      <div
        // className={styles.topicList}
        >
        <List>
          {content}
        </List>
      </div>
    )
  }

  render(){
    return (
      <div className={styles.topicList}>
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
