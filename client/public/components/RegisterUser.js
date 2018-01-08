import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
// import styles from '../css/app.css';

import RegisterUserForm from './RegisterUserForm';

class RegisterUser extends React.Component {
  constructor(props){
    super(props);
  }

  componentWillReceiveProps(nextProps){
    if(this.props != nextProps){
      console.log('new props');
      this.props = nextProps;

      if(this.props.user.authorized){
        console.log('User is authorized');
        this.props.history.push('/dashboard');
      }
    }
  }

  render(){
    return (
      <div>
        <RegisterUserForm />
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

  }
}

export default connect(mapStateToProps, mapDispatchToProps)(RegisterUser);
