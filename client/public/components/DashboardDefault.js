import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  NavLink
} from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

class DashboardDefault extends React.Component {
  constructor(props){
    super(props);


  }

  componentDidMount(){
    console.log('mounting');
    if(!this.props.user.authorized){
      console.log('User NOT AUTHORIZED, redirect to login page');
      this.props.history.push('/user/login');
    }else{
      console.log('User is Authorized');
    }
  }

  render(){
    return (
      <div>
        Dashboard Default<br />
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

export default connect(mapStateToProps, mapDispatchToProps)(DashboardDefault);
