import axios from 'axios';

export const createTopic = async (payload) => {
  const url = '/api/topics/create';

  console.log('post: ', url);

  return new Promise((fulfill, reject) => {
    axios.post(url, payload)
    .then(res => {
      if(res.data.api.success){
        fulfill(res);
      }else{
        reject(res);
      }
    })
    .catch(err => {
      reject(err);
    })
  })
}

export const getAllTopics = async (payload) => {
  const url = '/api/topics/all';

  console.log('get: ', url);

  return new Promise((fulfill, reject) => {
    axios.get(url)
    .then(res => {
      console.log(res);
      if(res.data.api.success){
        fulfill(res);
      }else{
        reject(res);
      }
    })
    .catch(err => {
      reject(err);
    })
  })
}
