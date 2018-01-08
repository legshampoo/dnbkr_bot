import React from 'react';
import { NavLink } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';

import { userLogin } from '../actions/userActions';

import { createTopic } from '../actions/topicActions';

class LoginForm extends React.Component {
  constructor(props){
    super(props);

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    this.state = {
      email: '',
      password: '',
    }
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
      email: this.state.email,
      password: this.state.password
    }

    this.props.userLogin(payload);
  }

  render(){
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <h1>Log In</h1>
          <TextField
            name='email'
            floatingLabelText='Email'
            value={this.state.email}
            onChange={this.handleChange} />
            <br />
          <TextField
            type='password'
            name='password'
            floatingLabelText='Password'
            value={this.state.password}
            onChange={this.handleChange} />
          <br />
          <RaisedButton
            label='Sign In'
            type='submit' />
        </form>
        <br />
        Not Registered? <NavLink to='/user/register'>Sign Up!</NavLink>
      </div>)
  }
}

const mapStateToProps = (state, ownProps) => {
  return {

  }
}

const mapDispatchToProps = dispatch => {
  return {
    userLogin: bindActionCreators(userLogin, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginForm);
