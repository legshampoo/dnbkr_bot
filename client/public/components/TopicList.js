import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {
  List,
  ListItem,
  makeSelectable
} from 'material-ui/List';
import Subheader from 'material-ui/Subheader';

import { getAllTopics, joinRoom } from '../actions/topicActions';

let SelectableList = makeSelectable(List);


function wrapState(ComposedComponent) {
  return class SelectableList extends Component {
    constructor(props){
      super(props);
      this.handleRequestChange = this.handleRequestChange.bind(this);

      this.state = {
        // selectedTopic: ''
      }
    }

    componentWillMount(){
      this.setState({
        // selectedTopic: this.props.defaultTopic
      });
    }

    handleRequestChange(e, topicName){
      console.log(topicName);

      this.setState({
        selectedTopic: topicName
      }, () => {
        console.log('changing room to: ', this.state.selectedTopic)
        this.props.joinRoom(this.state.selectedTopic);
      });
    }

    render(){
      return (
        <ComposedComponent
          value={this.state.selectedTopic}
          onChange={this.handleRequestChange} >
          {this.props.children}
        </ComposedComponent>
      );
    }
  }; //end component
}

const mapStateToProps = (state, ownProps) => {
  return {
    user: state.user,
    topicList: state.topics.topicList
  }
}

const mapDispatchToProps = dispatch => {
  return {
    getAllTopics: bindActionCreators(getAllTopics, dispatch),
    joinRoom: bindActionCreators(joinRoom, dispatch)
  }
}

SelectableList = connect(mapStateToProps, mapDispatchToProps)(wrapState(SelectableList));





class ListExampleSelectable extends Component {
  constructor(props){
    super(props);


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
          value={name}
          primaryText={name}>
        </ListItem>
      )

      content.push(topic);
    })

    return(
      <SelectableList defaultValue={'BTC'}>
        <Subheader>Topics</Subheader>
        {content}
      </SelectableList>
    )
  }

  render(){
    return(
      <div>
        {this.renderTopicList()}
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ListExampleSelectable);
