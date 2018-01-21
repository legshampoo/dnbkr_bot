
// const io = require('socket.io')();
var logger = require('tracer').colorConsole();
const Topic = require('../models/Topic');
// const gdax_bot = require('../bots/trading/gdax/gdax_bot');
const gdax_bot = require('../bots/trading/gdax/bot');

var connections = [];

var socketServer = {

  init: (io) => {

    logger.info('Socket server started');

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

          // if(socket.room){
          //   socket.leave(socket.room);  //need to make an '/leave room endpoint'
          // }

          socket.room = room;
          socket.join(room)

          if(room === 'market_feed'){
            //do nothing, it's not a topic
          }else{
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
            // console.log('topic.name: ', topic[0].name);
            // console.log('historicalData.length: ', topic.historicalData.length);

            var payload = {
              name: topic[0].name,
              historicalData: topic[0].historicalData
            }

            socket.emit('action', {
              type: 'topic_data',
              payload: payload
            });

          }

          console.log('SOCKET: Client is now in rooms: ');

          Object.keys(socket.rooms).forEach((room) => {
            console.log('room: ', room);
          })
        }//END IF

        if(action.type === 'server/cancel_all_orders'){
          console.log('Client Command: CANCEL ALL OPEN ORDERS');
          gdax_bot.cancelAllOrders();
        }

        if(action.type === 'server/execute_market_buy'){
          console.log('Client Command: EXECUTE MARKET BUY');
          // gdax_bot.executeBuyOrder(io);
          gdax_bot.executeBuyOrder();
        }

        if(action.type === 'server/execute_market_sell'){
          console.log('Client Command: EXECUTE MARKET SELL');
          // gdax_bot.executeSellOrder(io);
          gdax_bot.executeSellOrder();
        }
      })
    });

    io.on('disconnect', () => {
      console.log('SOCKET: disconnected ', socket.id);
    });
  }
}

module.exports = socketServer;
