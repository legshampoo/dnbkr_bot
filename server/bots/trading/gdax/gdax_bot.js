require('dotenv').config({ path: 'variables.env' });
var logger = require('tracer').colorConsole();
const moment = require('moment');

const Order = require('../../../models/Order');

const Gdax = require('gdax');

const gdax_orderbook = require('./gdax_orderbook');
const gdax_bot_tests = require('./gdax_bot_tests');

const key = process.env.GDAX_KEY;
const secret = process.env.GDAX_SECRET;
const passphrase = process.env.GDAX_PASSPHRASE;
const baseURI = 'https://api.gdax.com';

var TRADING_ENABLED = true;

var prevBuyTime = moment().format('YYYY-DD-MM HH:mm:ss');

const authedClient = new Gdax.AuthenticatedClient(
  key,
  secret,
  passphrase,
  baseURI
);

const publicClient = new Gdax.PublicClient('BTC-USD', baseURI);

var io;

var bot = {

  BTC_USD_PRICE: 0,

  minimumOrderSize: 0.001,

  previousBuy: moment(),

  previousSell: moment(),

  tradeWaitTime: 60, //seconds


  init: async (_io) => {
    console.log('init gdax bot');

    console.log('GDAX BOT: TRADING ENABLED: ', TRADING_ENABLED);

    io = _io;

    // gdax_bot_tests.checkTimeElapsed();

    bot.initHeartbeat();
    // bot.getProducts();
    bot.initAccountInfo();
  },

  getProducts: () => {
    console.log('get products');
    publicClient
      .getProducts()
      .then(res => {
        console.log('get products: ');
        console.log(res);
      })
      .catch(err => {
        console.log(err);
      })
  },

  initAccountInfo: () => {
    var secInterval = 30;
    bot.getAccountInfo();

    setInterval(() => {
      bot.getAccountInfo();
    }, 1000 * secInterval);
  },

  tradingStatus: (status) => {
    TRADING_ENABLED = status;

    if(TRADING_ENABLED){
      console.log('GDAX BOT: TRADING HAS BEEN ENABLED');
    }else{
      console.log('GDAX BOT: TRADING HAS BEEN DISABLED');
    }
  },

  getAccountInfo: () => {
    authedClient.getAccounts()
      .then(res => {
        var currentTime = moment().format('YYYY-MM-DD HH:mm:ss');
        var accounts = {};

        res.forEach((item, index) => {
          var key = item.currency;
          accounts[key] = item;
        });

        var payload = accounts;

        io.to('market_feed').emit('action', {
          type: 'account_status',
          payload: payload
        });
      })
      .catch(err => {
        console.log(err);
      });
  },

  update: (payload) => {
    console.log('bot command: ', payload.command);
    console.log(payload);

    var payload = {
      exchange: 'GDAX',
      pair: 'BTC_USD',
      command: payload.command,
      data: {
        ...payload.data
      }
    };

    io.to('market_feed').emit('action', {
      type: 'bot_command',
      payload: payload
    });
  },

  initHeartbeat: () => {
    // var command = 'BOT_COMMAND_TEST';

    // console.log('bot command: ', command);
    setInterval(() => {
      var payload = {
        status: 'alive',
        time: moment().format('YYYY-DD-MM HH:mm:ss'),
        exchange: 'GDAX',
        pair: 'BTC_USD',
      };

      io.to('market_feed').emit('action', {
        type: 'bot_status',
        payload: payload
      });
    }, 5000);
  },

  // executeMarketBuy: async (io) => {
  executeMarketBuy: async (io) => {

    // console.log('buy');
    var time = moment();
    // console.log('time: ', time);
    //
    var elapsed = time.diff(bot.previousBuy, 'seconds');
    // var elapsed = time.diff(previousBuy, 'seconds');
    //
    // console.log('elapsed: ', elapsed);


    if(elapsed < bot.tradeWaitTime){
      console.log('GDAX BOT: Wait ' + bot.tradeWaitTime + ' seconds before next trade');
      return
    }else{
      console.log('enough time has elapsed, ok to trade');
      bot.previousBuy = time;
    }

    var orderbook = await gdax_orderbook.getOrderBook();
    var topBid = parseFloat(orderbook.bids[0][0]);
    var bidPrice = topBid + .01;
    // var bidPrice = topBid;

    if(!TRADING_ENABLED){
      console.log('GDAX BOT: TRADING DISABLED');
      var payload = {
        action: 'NULL_BUY',
        time: time.toString(),
        size: bot.minimumOrderSize,
        price: bidPrice,
        exchange: 'GDAX',
        pair: 'BTC_USD'
      }

      bot.saveOrder(payload);

      return
    }

    const params = {
      price: bidPrice,
      size: bot.minimumOrderSize,
      product_id: 'BTC-USD',
      time_in_force: 'GTT',
      cancel_after: 'hour'
    }

    // console.log('GDAX BOT COMMAND: BUY:');
    // console.log(params);

    authedClient.buy(params)
      .then(res => {
        // console.log('GDAX BOT: market_buy response ');
        console.log(res);
        var time = moment().format('YYYY-MM-DD HH:mm:ss');

        var payload = {
          time: time,
          price: params.price,
          action: 'MARKET_BUY',
          size: params.size,
          exchange: 'GDAX',
          pair: 'BTC_USD'
        }

        io.to('market_feed').emit('action', {
          type: 'bot_action',
          payload: payload
        });

        bot.saveOrder(payload);

      })
      .catch(err => {
        console.log(err);
      })
  },

  saveOrder: async (payload) => {
    const order = new Order({
      order: payload.action,
      time: payload.time.toString(),
      size: payload.size,
      price: payload.price,
      exchange: payload.exchange,
      pair: payload.pair
    });

    order.save()
      .then(res => {
        console.log('GDAX BOT: Market order saved to database');
        console.log('TYPE: ', payload.action);
        return
      })
      .catch(err => {
        console.log('GDAX BOT: Error saving order to mongodb');
        console.log(err);
        return
      })
  },

  executeMarketSell: async (io) => {

    var time = moment();

    var elapsed = time.diff(bot.previousSell, 'seconds');

    if(elapsed < bot.tradeWaitTime){
      console.log('GDAX BOT: Wait ' + bot.tradeWaitTime + ' seconds before next trade');
      return
    }else{
      // console.log('enough time has elapsed, ok to trade');
      bot.previousSell = time;
    }

    var orderbook = await gdax_orderbook.getOrderBook();

    var lowestAsk = parseFloat(orderbook.asks[0][0]);

    var askPrice = lowestAsk - .01;
    // var askPrice = lowestAsk;

    if(!TRADING_ENABLED){
      console.log('GDAX BOT: TRADING DISABLED');

      var time = moment().format('YYYY-MM-DD HH:mm:ss');
      var payload = {
        action: 'NULL_SELL',
        time: time.toString(),
        size: bot.minimumOrderSize,
        price: askPrice,
        exchange: 'GDAX',
        pair: 'BTC_USD'
      }

      bot.saveOrder(payload);

      return
    }

    var params = {
      price: askPrice,
      size: bot.minimumOrderSize,
      product_id: 'BTC-USD',
      time_in_force: 'GTT',
      cancel_after: 'hour'
    }

    authedClient.sell(params)
      .then(res => {
        // console.log('SELL RESPONSE: ');
        console.log(res);

        var time = moment().format('YYYY-MM-DD HH:mm:ss');

        var payload = {
          time: time,
          currentPrice: params.price,
          action: 'SELL',
          size: params.size,
          exchange: 'GDAX',
          pair: 'BTC_USD'
        }

        io.to('market_feed').emit('action', {
          type: 'bot_action',
          payload: payload
        });

        bot.saveOrder(payload);
      })
      .catch(err => {
        console.log(err);
      })

  },

  cancelAllOrders: () => {
    console.log('Trading Bot: GDAX bot command cancel_all_orders');

    authedClient.cancelAllOrders()
      .then(res => {
        if(res.length === 0){
          console.log('GDAX BOT: no open orders to cancel');
          console.log(res);
        }
      })
      .catch(err => {
        console.log(err);
      })
  }


}

module.exports = bot;
