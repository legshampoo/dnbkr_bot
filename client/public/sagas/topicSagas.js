import {
  call,
  put,
  takeEvery,
  takeLatest
} from 'redux-saga/effects';

import {
  createTopic,
  getAllTopics
} from '../api/topicApi';

import {
  CREATE_TOPIC,
  CREATE_TOPIC_SUCCESS,
  CREATE_TOPIC_FAIL,
  GET_ALL_TOPICS,
  GET_ALL_TOPICS_SUCCESS,
  GET_ALL_TOPICS_FAIL,
} from '../actions/topicActions';

function * create_topic(action){
  try{
    const response = yield call(createTopic, action.payload);
    yield put({
      type: CREATE_TOPIC_SUCCESS,
      payload: response
    });
  }catch(e){
    yield put({
      type: CREATE_TOPIC_FAIL,
      payload: e
    });
  }
}

function * get_all_topics(action){
  try{
    const response = yield call(getAllTopics, action.payload);
    yield put({
      type: GET_ALL_TOPICS_SUCCESS,
      payload: response
    });
  }catch(e){
    yield put({
      type: GET_ALL_TOPICS_FAIL,
      payload: e
    });
  }
}

function * sagas(){
  yield takeEvery('CREATE_TOPIC', create_topic);
  yield takeEvery('GET_ALL_TOPICS', get_all_topics);
}

export default sagas;
