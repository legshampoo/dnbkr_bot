import React from 'react';
import { NavLink } from 'react-router-dom';
// import styles from '../css/app.css';


class Home extends React.Component {
  render(){
    return (
      <div>
        Home <br />
        <NavLink to='/user/login'>
          Log In
        </NavLink>
        <br />
        <NavLink to='/user/register'>
          Create an Account
        </NavLink>
      </div>)
  }
}

export default Home;
