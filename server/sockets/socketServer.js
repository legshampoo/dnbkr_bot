
const io = require('socket.io')();
const connections = [];

var room1 = 'room1';
var room2 = 'room2';

var socketServer = {
  init: (server) => {

    var options = {};

    io.listen(server, options);

    console.log('SOCKET: listening on port ', server.address().port);

    io.on('connection', (socket) => {
      connections.push(socket);
      var socketIp = socket.handshake.address;

      console.log('SOCKET: new connection from ' + socketIp + ', socket ID: ' + socket.id);

      socket.on('action', (action) => {
        if(action.type === 'server/hello'){
          console.log('got hello data muhfuh!', action.payload);
          socket.emit('action', { type: 'message', payload: 'good day!' })
        }

        if(action.type === 'server/subscribeToHeartbeat'){
          console.log('SOCKET: server/subscribeToHeartbeat');

          setInterval(() => {
            var payload = {
              connected: true,
              timestamp: new Date()
            }
            socket.emit('action', {
              type: 'heartbeat',
              payload: payload

            });
          }, 1000);
        }  //end if

        if(action.type === 'server/join_room'){
          console.log('SOCKET: server/join_room');

          console.log(action.payload);

          var room = action.payload;

          socket.join(room)

          var payload = {
            topic: room,
            topic_data: 'this is all the data'
          }

          socket.emit('action', {
            type: 'topic_data',
            payload: payload
          })
        }
      })
    });

    io.on('disconnect', () => {
      console.log('SOCKET: disconnected ', socket.id);
    });

    setInterval(() => {
      console.log('sending to rooms');
      // io.sockets.in(room1).emit('message', 'this is for room 1');
      io.sockets.in(room1).emit('action', {
        type: 'message',
        payload: 'this is for room 1'

      });
      // io.sockets.in(room2).emit('message', 'this is for room 2');
      io.sockets.in(room2).emit('action', {
        type: 'message',
        payload: 'this is for room 2'

      });
    }, 2000);

  }
}

module.exports = socketServer;
