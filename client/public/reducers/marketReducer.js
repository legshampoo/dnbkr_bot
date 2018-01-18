// import {
//   CREATE_TOPIC_SUCCESS,
//   CREATE_TOPIC_FAIL,
//   GET_ALL_TOPICS_SUCCESS,
//   GET_ALL_TOPICS_FAIL
// } from '../actions/topicActions';

const initialState = {}

function marketReducer(state = initialState, action){

  switch(action.type){

    case 'market_feed':
      // console.log(action);
      var data = action.payload;

      return {
        ...state,
        ...data
      }

    case 'bot_status':
      // console.log(action);
      const bot_status = {
        ...action.payload
      }

      return {
        ...state,
        bot_status: bot_status
      }

    case 'bot_event':
      console.log(action);
      return state

    case 'account_status':
      // console.log(action);
      const accounts = {
        ...action.payload
      }

      return {
        ...state,
        accounts: accounts
      }

    case 'macd':
      console.log(action);

      let macd = action.payload.macd;

      return {
        ...state,
        macd: macd
      }

    case 'historical_data':
      console.log(action);

      return {
        ...state,
        historicalData: action.payload.historicalData
      }

    case 'trade_decision':
      console.log(action);

      return {
        ...state,
        marketDecisions: {
          ...action.payload
        }
      }

    default:
      return state


  }
}

export default marketReducer;
