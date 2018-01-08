import 'regenerator-runtime/runtime';

import {
  put,
  takeEvery,
  all
} from 'redux-saga/effects';

import userSagas from './userSagas';
import topicSagas from './topicSagas';

export default function* rootSaga(){
  yield all([
    userSagas(),
    topicSagas()
  ])
}
