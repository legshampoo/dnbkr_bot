import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux'

import userReducer from './userReducer';
import topicReducer from './topicReducer';

const rootReducer = combineReducers({
  user: userReducer,
  topics: topicReducer
});

export default rootReducer;
