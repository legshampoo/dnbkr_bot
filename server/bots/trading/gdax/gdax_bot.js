require('dotenv').config({ path: 'variables.env' });
var logger = require('tracer').colorConsole();
const moment = require('moment');

const Gdax = require('gdax');

const key = process.env.GDAX_KEY;
const secret = process.env.GDAX_SECRET;
const passphrase = process.env.GDAX_PASSPHRASE;
const baseURI = 'https://api.gdax.com';


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

  minimumOrderSize: 0.0001,

  init: async (_io) => {
    console.log('init gdax bot');
    io = _io;

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
    var secInterval = 10;
    bot.getAccountInfo();

    setInterval(() => {
      bot.getAccountInfo();
    }, 1000 * secInterval);
  },

  getAccountInfo: () => {
    console.log('GDAX_BOT: updating account info for BTC/USD');

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
    }, 1000);
  },

  executeMarketBuy: () => {
    console.log('bot executeMarketBuy: ');

    const params = {
      price: bot.BTC_USD_PRICE,
      size: bot.minimumOrderSize,
      product_id: BTC_USD
    }

    console.log(params);

    authedClient.buy(params)
      .then(res => {
        console.log('GDAX BOT: market_buy response ');
        console.log(res);
      })
      .catch(err => {
        console.log(err);
      })
  },

  executeMarketSell: () => {
    console.log('bot executeMarketSell');

    var params = {
      price: bot.BTC_USD_PRICE,
      size: bot.minimumOrderSize,
      product_id: 'BTC-USD'
    }

    authedClient.sell(params)
      .then(res => {
        console.log('SODL RESPONSE: ');
        console.log(res);
      })
      .catch(err => {
        console.log(err);
      })

    console.log(params);
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
