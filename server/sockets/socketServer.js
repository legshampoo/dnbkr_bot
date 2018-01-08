
//move this elsewhere once it works
const io = require('socket.io')();
// const socketPort = 8000;


var socketServer = {
  init: (server) => {

    io.listen(server);

    // console.log(server.address().port);

    console.log('SOCKETS listening on port ', server.address().port);

    io.on('connection', (client) => {
      var socketId = client.id;
      var clientIp = client.handshake.headers.host;

      console.log('New socket connection from ' + clientIp);

      client.on('subscribeToTimer', (interval) => {
        console.log('client is subscribing to timer with interval ', interval);
        setInterval(() => {
          client.emit('timer', new Date());
        }, interval);
      })
    })

  }
}

module.exports = socketServer;
