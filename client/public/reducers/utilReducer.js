
const initialState = {}

function utilReducer(state = initialState, action){
  switch(action.type){

    case 'message':
      console.log(action);
      return {
        ...state,
        message: action.payload
      }

    case 'heartbeat':
      // console.log(action);
      return {
        ...state,
        heartbeat: {
          connected: action.payload.connected,
          timestamp: action.payload.timestamp
        }
      }

    case 'topic_data':
      console.log(action);

      return {
        ...state,
        topic: action.payload.topic,
        topicData: action.payload.topicData
      }

    default:
      return state;
  }
}

export default utilReducer = utilReducer;
