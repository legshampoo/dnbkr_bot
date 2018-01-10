import React from 'react';
// import styles from '../css/app.css';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import LoginForm from './LoginForm';

class Login extends React.Component {
  constructor(props){
    super(props);
  }

  componentWillReceiveProps(nextProps){
    if(this.props != nextProps){
      this.props = nextProps;
      if(this.props.user.authorized){
        this.props.history.push('/dashboard');
      }
    }
  }

  render(){
    return (
      <div>
        <LoginForm />
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

export default connect(mapStateToProps, mapDispatchToProps)(Login);
