import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  NavLink
} from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

// import styles from '../css/app.css';
import AppBar from 'material-ui/AppBar';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import IconMenu from 'material-ui/IconMenu';
import IconButton from 'material-ui/IconButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import MenuIcon from 'material-ui/svg-icons/navigation/menu';
import RaisedButton from 'material-ui/RaisedButton';

import DashboardDefault from './DashboardDefault';
import TopicManager from './TopicManager';
import TopicChart from './TopicChart';

import LogoutForm from './LogoutForm';

import { sendMessage, subscribeToHeartbeat, joinRoom } from '../actions/utilActions';

class DashboardHome extends React.Component {
  constructor(props){
    super(props);

    // this.renderHeartbeat = this.renderHeartbeat.bind(this);
    this.joinRoom = this.joinRoom.bind(this);

  }

  componentDidMount(){
    if(!this.props.user.authorized){
      console.log('User NOT AUTHORIZED, redirect to login page');
      this.props.history.push('/user/login');
    }else{
      console.log('User is Authorized');
    }

    this.props.sendMessage();
    this.props.subscribeToHeartbeat();

  }

  componentWillReceiveProps(nextProps){
    if(this.props != nextProps){
      this.props = nextProps;
      if(!this.props.user.authorized){
        console.log('Unauthorized, redirect to login page');
        this.props.history.push('/user/login');
      }
    }
  }

  handleClick_dropDown(event, path, value){
    console.log(this.props.match.path);
    console.log('path: ', path);
    this.props.history.push('/dashboard/' + path);
  }

  renderHeartbeat(){
    // var timestamp = this.props.utils.heartbeat.timestamp;
    // console.log(this.props.utils.heartbeat.timestamp);
    if(this.props.utils.heartbeat !== undefined){
      var timestamp = this.props.utils.heartbeat.timestamp;

      return(
        <div>
          {timestamp}
        </div>
      )
    }else{
      return
    }

  }

  joinRoom(e){
    // e.preventDefault();

    console.log(e.currentTarget.value);
    // console.log(e.target.value);
    this.props.joinRoom(e.currentTarget.value);
  }

  // joinRoom2(e){
  //   e.preventDefault();
  //   this.props.joinRoom('room2');
  // }

  render(){
    return (
      <div>
        <AppBar
          title='Dashboard'
          showMenuIconButton={false}
          iconClassNameRight='muidocs-icon-naviagtion-expand-more'>
          <div>
            {this.renderHeartbeat()}
          </div>
          <IconMenu
            iconButtonElement={<IconButton><MoreVertIcon /></IconButton>}
            anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
            onChange={(e, path, value) => this.handleClick_dropDown(e, path, value)}
            targetOrigin={{horizontal: 'left', vertical: 'top'}}>
            <MenuItem
              primaryText='Home'
              value='' />
            <MenuItem
              primaryText='Manage Topics'
              value='topics/manage' />
            <MenuItem
              primaryText='Topic Chart'
              value='topics/chart' />
          </IconMenu>
          Name: {this.props.user.data.name} <br />
          Email: {this.props.user.data.email} <br />
          <LogoutForm />
        </AppBar>
        <RaisedButton
          label='Join Room 1'
          value='room1'
          id='room1'
          onClick={this.joinRoom}/>
        <RaisedButton
          label='Join Room 2'
          value='room2'
          id='room2'
          onClick={this.joinRoom}/>
        <Route exact path={`${this.props.match.path}/`} component={DashboardDefault} />
        <Route exact path={`${this.props.match.path}/topics/manage`} component={TopicManager} />
        <Route exact path={`${this.props.match.path}/topics/chart`} component={TopicChart} />
      </div>)
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    user: state.user,
    utils: state.utils
  }
}

const mapDispatchToProps = dispatch => {
  return {
    sendMessage: bindActionCreators(sendMessage, dispatch),
    subscribeToHeartbeat: bindActionCreators(subscribeToHeartbeat, dispatch),
    joinRoom: bindActionCreators(joinRoom, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(DashboardHome);
