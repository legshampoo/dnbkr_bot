require('dotenv').config({ path: 'variables.env' });
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');  //middleware used for validating data before entering into mongodb
const historyApiFallback = require('connect-history-api-fallback');
var logger = require('tracer').colorConsole();
var errorhandler = require('errorhandler');

// const session = require('express-session');  //manages sessions
const mongoose = require('mongoose');  //interface for mongodb
const passport = require('passport');
const session = require('express-session');
// const MongoStore = require('connect-mongo')(session);

const io = require('socket.io')();
const socketServer = require('./server/sockets/socketServer');

// const socketServer = require('./server/sockets/socketServer');
//START BOTS
const reddit_bot = require('./server/bots/reddit/reddit_bot');
const gdax_market_feed = require('./server/bots/trading/gdax/gdax_market_feed');
// const gdax_bot = require('./server/bots/trading/gdax/gdax_bot');

const database = require('./server/database/database');

const app = express();

const DEFAULT_PORT = 3000;
const env = process.env.NODE_ENV || 'NOT DEFINED';
app.set("port", process.env.PORT || DEFAULT_PORT);

//this needs to come AFTER model imports
const routes = require('./server/routes/routes');

app.use(express.static(path.join(__dirname, '/client/dist')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
//this needs to be before passport.session
app.use(session({
  secret: 'session-secret',
  resave: true,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(expressValidator());  //for validating data before mongo entry, applies the methods to all requests, you just call ie req.sanitize('name')
app.use('/api', routes);
app.use(errorhandler({
  dumpExceptions: true,
  showStack: true
}))


if(env == 'development'){
  console.log('\n');
  console.log("================================================>")
  console.log('\n \n')
  console.log('Sever running in DEVELOPMENT MODE');
  console.log('\n \n')

  const webpack = require('webpack');
  const webpackDevMiddleware = require('webpack-dev-middleware');
  const webpackHotMiddleware = require('webpack-hot-middleware');
  const config = require('./webpack.config.dev.js');
  const compiler = webpack(config);

  app.use(historyApiFallback({
    verbose: false
  }));

  app.use(webpackDevMiddleware(compiler, {
    hot: true,
    publicPath: config.output.publicPath,
    chunks: false,
    'errors-only': true,
    stats: {
      colors: true
    }
  }));

  app.use(webpackHotMiddleware(compiler, {
    log: console.log
  }));

}else{
  console.log('\n');
  console.log("================================================>")
  console.log('\n \n')
  console.log('Server running in PRODUCTION MODE');
  console.log('\n \n');
}

app.get('*', (req, res) => {
  console.log('got request');
  var clientHostname = req.headers.host;
  console.log('Hostname: ' + clientHostname);
  res.sendFile(__dirname + '/client/dist/index.html');
});

process.on('uncaughtException', function (exception) {
  console.log('process uncaught exception');
  // console.log(exception); // to see your exception details in the console
  logger.error(exception);
  // if you are on production, maybe you can send the exception details to your
  // email as well ?
});

const server = app.listen(app.get('port'), '0.0.0.0', function () {
  console.log('Server listening on port ' + app.get('port') + '!\n');
  database.init();
  io.listen(server);

  // socketServer.init(io);
  // reddit_bot.init(io);
  // gdax_market_feed.init(io);  //also kicks off the trading bot
  // gdax_bot.init(io);
});

setInterval(() => {
  console.log('eh');
}, 3000);
