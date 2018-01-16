export const SUBSCRIBE_TO_MARKET_FEED = 'server/subscribe_to_market_feed';
export const CANCEL_ALL_ORDERS = 'server/cancel_all_orders';
export const EXECUTE_MARKET_BUY = 'server/execute_market_buy';
export const EXECUTE_MARKET_SELL = 'server/execute_market_sell';

export function createTopic(values){
  console.log('DISPATCH: ', SUBSCRIBE_TO_MARKET_FEED);
  return {
    type: SUBSCRIBE_TO_MARKET_FEED,
    payload: values
  }
}

export function getAllTopics(values){
  console.log('DISPATCH: ', GET_ALL_TOPICS);
  return {
    type: GET_ALL_TOPICS,
    payload: values
  }
}


export function joinRoom(values){
  console.log('DISPATCH: ', JOIN_ROOM);

  return {
    type: 'server/join_room',
    payload: values
  }
}

export function cancelAllOrders(values){
  console.log('DISPATCH: ', CANCEL_ALL_ORDERS);

  return {
    type: CANCEL_ALL_ORDERS,
    payload: values
  }
}

export function executeMarketBuy(values){
  console.log('DISPATCH: ', EXECUTE_MARKET_BUY);

  return {
    type: EXECUTE_MARKET_BUY,
    payload: values
  }
}

export function executeMarketSell(values){
  console.log('DISPATCH: ', EXECUTE_MARKET_SELL);

  return {
    type: EXECUTE_MARKET_SELL,
    payload: values
  }
}
