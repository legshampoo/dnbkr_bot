import openSocket from 'socket.io-client';
const socket = openSocket('http://localhost:3000');
// const socket = openSocket(window.location.hostname);

function subscribeToTimer(cb){
  socket.on('timer', timestamp => cb(null, timestamp));
  socket.emit('subscribeToTimer', 1000);
}

function unmount(cb){
  console.log('closing');
  socket.close();
}

export { subscribeToTimer, unmount }
