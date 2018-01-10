import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  NavLink
} from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import styles from '../css/app.css';

class DashboardDefault extends React.Component {
  constructor(props){
    super(props);


  }

  componentDidMount(){
    if(!this.props.user.authorized){
      console.log('User NOT AUTHORIZED, redirect to login page');
      this.props.history.push('/user/login');
    }
  }

  render(){
    return (
      <div className={styles.DashboardDefault}>
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
