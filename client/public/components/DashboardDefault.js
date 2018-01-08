import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  NavLink
} from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { subscribeToTimer, unmount } from '../api/socket';

class DashboardDefault extends React.Component {
  constructor(props){
    super(props);

    // subscribeToTimer((err, timestamp) => this.setState({
    //   timestamp
    // }), () => {
    //   console.log('got socket message');
    // });

    this.state = {
      timestamp: 'no timestamp yet'
    }
  }

  componentDidMount(){
    console.log('mounting');
    if(!this.props.user.authorized){
      console.log('User NOT AUTHORIZED, redirect to login page');
      this.props.history.push('/user/login');
    }else{
      console.log('User is Authorized');
    }

    subscribeToTimer((err, timestamp) => this.setState({
      timestamp
    }), () => {
      console.log('got socket message');
    });
  }

  componentWillUnmount(){
    console.log('unmount');
    unmount();
  }

  render(){
    return (
      <div>
        Dashboard Default<br />
        {this.state.timestamp}
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
