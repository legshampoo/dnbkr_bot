
const io = require('socket.io')();
const connections = [];

const Topic = require('../models/Topic');

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

      socket.on('action', async (action) => {
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
          var room = action.payload;
          console.log('SOCKET: server/join_room ', room);

          if(socket.room){
            socket.leave(socket.room);
          }

          socket.room = room;
          socket.join(room)

          var name = room;
          var query = { name: name };
          const topic = await Topic.find(query)
            .then(res => {
              // console.log('RES: ');
              // console.log(res);
              return res;
            })
            .catch(err => {
              console.log(err);
              return
            })

          // topic = topic[0];
          console.log('topic.name: ', topic[0].name);
          // console.log('historicalData.length: ', topic.historicalData.length);

          var payload = {
            name: topic[0].name,
            historicalData: topic[0].historicalData
          }

          socket.emit('action', {
            type: 'topic_data',
            payload: payload
          });

          console.log('SOCKET: Client is now in rooms: ');

          Object.keys(socket.rooms).forEach((room) => {
            console.log('room: ', room);
          })
        }
      })
    });

    io.on('disconnect', () => {
      console.log('SOCKET: disconnected ', socket.id);
    });

    setInterval(() => {
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
