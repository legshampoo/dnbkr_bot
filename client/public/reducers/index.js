import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux'

import userReducer from './userReducer';
import topicReducer from './topicReducer';
import utilReducer from './utilReducer';

const rootReducer = combineReducers({
  user: userReducer,
  topics: topicReducer,
  utils: utilReducer
});

export default rootReducer;
