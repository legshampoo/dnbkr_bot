export const CREATE_TOPIC = 'CREATE_TOPIC'
export const CREATE_TOPIC_SUCCESS = 'CREATE_TOPIC_SUCCESS';
export const CREATE_TOPIC_FAIL = 'CREATE_TOPIC_FAIL';
export const GET_ALL_TOPICS = 'GET_ALL_TOPICS'
export const GET_ALL_TOPICS_SUCCESS = 'GET_ALL_TOPICS_SUCCESS';
export const GET_ALL_TOPICS_FAIL = 'GET_ALL_TOPICS_FAIL';
export const JOIN_ROOM = 'JOIN_ROOM';

export function createTopic(values){
  console.log('DISPATCH: ', CREATE_TOPIC);
  return {
    type: CREATE_TOPIC,
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
