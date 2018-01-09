export const SEND_MESSAGE = 'SEND_MESSAGE';
export const SUBSCRIBE_TO_HEARTBEAT = 'SUBSCRIBE_TO_HEARTBEAT';
export const JOIN_ROOM = 'JOIN_ROOM';

export function sendMessage(values){
  console.log('DISPATCH: ', SEND_MESSAGE);
  return {
    type: 'server/hello',
    payload: 'Hello!'
  }
}

export function subscribeToHeartbeat(values){
  console.log('DISPATCH: ', SUBSCRIBE_TO_HEARTBEAT);

  return {
    type: 'server/subscribeToHeartbeat',
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
