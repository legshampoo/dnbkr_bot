import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux'

import userReducer from './userReducer';
import topicReducer from './topicReducer';
import utilReducer from './utilReducer';
import marketReducer from './marketReducer';

const rootReducer = combineReducers({
  user: userReducer,
  topics: topicReducer,
  utils: utilReducer,
  market: marketReducer
});

export default rootReducer;
