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
      console.log('new props');
      this.props = nextProps;
      if(this.props.user.authorized){
        console.log('User is authed');
        this.props.history.push('/dashboard/home');
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

// export default Login;


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

// export default LoginForm;
export default connect(mapStateToProps, mapDispatchToProps)(Login);
