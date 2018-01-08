import {
  CREATE_TOPIC_SUCCESS,
  CREATE_TOPIC_FAIL,
  GET_ALL_TOPICS_SUCCESS,
  GET_ALL_TOPICS_FAIL
} from '../actions/topicActions';

const initialState = {}

function topicReducer(state = initialState, action){

  switch(action.type){

    case CREATE_TOPIC_SUCCESS:
      console.log(action);
      return {
        ...state,
        topicList: action.payload.data.topicList
      }

    case CREATE_TOPIC_FAIL:
      console.log(action);
      return state

    case GET_ALL_TOPICS_SUCCESS:
      console.log(action);
      return {
        ...state,
        topicList: action.payload.data.topicList
      }

    case GET_ALL_TOPICS_FAIL:
      console.log(action);
      return state

    default:
      return state
  }
}

export default topicReducer;
