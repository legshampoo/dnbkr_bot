import React from 'react';
import {
  Route,
  Switch
} from 'react-router-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import styles from '../css/app.css';
// import '../css/app.css';

import Home from './Home';
import Dashboard from './Dashboard';
import Login from './Login';
import RegisterUser from './RegisterUser';
import NotFound from './NotFound';

class App extends React.Component {
  render(){
    return (
      <div className={styles.app}>
        <MuiThemeProvider>
          <Switch>
            <Route exact path='/' component={Home} />
            <Route exact path='/user/login' component={Login} />
            <Route exact path='/user/register' component={RegisterUser} />
            <Route path='/dashboard' component={Dashboard} />
            <Route component={NotFound} />
          </Switch>
        </MuiThemeProvider>
      </div>)
  }
}

export default App;
