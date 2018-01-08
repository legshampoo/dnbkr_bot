import React from 'react';
// import styles from '../css/app.css';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';

import { createTopic } from '../actions/topicActions';

class AddTopicForm extends React.Component {
  constructor(props){
    super(props);

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    this.state = {
      name: ''
    }
  }

  componentWillReceiveProps(nextProps){

  }

  handleChange(e){
    const key = e.target.name;
    const value = e.target.value;

    this.setState({
      [key]: value
    });
  }

  handleSubmit(e){
    e.preventDefault();

    var payload = {
      name: this.state.name
    }

    this.props.createTopic(payload);
  }

  render(){
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <h1>Add Topic</h1>
          <TextField
            name='name'
            floatingLabelText='Topic Name'
            value={this.state.name}
            onChange={this.handleChange} />
            <br />
          <RaisedButton
            label='Create Topic'
            onClick={this.handleSubmit} />
        </form>
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
    createTopic: bindActionCreators(createTopic, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AddTopicForm);
