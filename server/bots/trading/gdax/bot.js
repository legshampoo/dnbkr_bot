require('dotenv').config({
  path: 'variables.env'
});

var logger = require('tracer').colorConsole();
const Gdax = require('gdax');
const axios = require('axios');

const marketData = require('./gdax_market_feed');
const Trade = require('../../../models/Trade');
const key = process.env.GDAX_KEY;
const secret = process.env.GDAX_SECRET;
const passphrase = process.env.GDAX_PASSPHRASE;
const baseURI = 'https://api.gdax.com';

const publicClient = new Gdax.PublicClient('BTC-USD', baseURI);
const authedClient = new Gdax.AuthenticatedClient(
  key,
  secret,
  passphrase,
  baseURI
);


const moment = require('moment');

var io;
module.exports.minOrderSize = 0.001;
module.exports.orderAdjustment = 0;
module.exports.gdaxOrders = [];
module.exports.openOrders = [];
module.exports.TRADING_ENABLED = true;
module.exports.BTC_USD = 'BTC-USD';
module.exports.tradeWaitPeriod = 60;
module.exports.lastTrade = moment();

module.exports.init = (_io) => {
  io = _io;
  console.log('GDAX BOT INIT');
  this.initHeartbeat(io);
  this.initAccountData();
  this.initOrderAdjustments();
}

module.exports.initHeartbeat = (io) => {
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
    }, 2000);
}

module.exports.initAccountData = () => {
  var secInterval = 30;
    this.getAccountInfo();

    setInterval(() => {
      this.getAccountInfo();
    }, 1000 * secInterval);
}

module.exports.getAccountInfo = () => {
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
}

module.exports.initOrderAdjustments = () => {
  var adjustRate = 2;  //seconds
  setInterval(() => {
    this.adjustOpenOrders();
  }, 1000 * adjustRate)
}

module.exports.adjustOpenOrders = async () => {
  this.getOpenOrders()
    .then(res => {
      this.openOrders = res;
      if(this.openOrders.length > 0){
        this.openOrders.forEach(async (order) => {
          if(order.side === 'buy' && order.price < marketData.bidPrice){
            console.log('GDAX BOT: Adjusting order for slippage');

            this.cancelAllOrders()
              .then(res => {
                this.executeBuyOrder();
              })
              .catch(err => {
                console.log(err);
              })
          }

          if(order.side === 'sell' && order.price > marketData.askPrice){
            console.log('GDAX BOT: Adjusting order for slippage');

            this.cancelAllOrders()
              .then(res => {
                this.executeSellOrder();
              })
              .catch(err => {
                console.log(err);
              })
          }
        })
      }

    })
    .catch(err => {
      console.log(err);
      return
    })
}

module.exports.getOpenOrders = () => {
  return authedClient.getOrders({
        status: 'open'
      })
      .then(res => {
        return res
      })
      .catch(err => {
        console.log(err);
      })
}

module.exports.executeBuyOrder = async (orders) => {
    var time = moment();
    // console.log('BUY');
    console.log('CHECKING ORDERS IN BOOK: ', this.openOrders);

    if(this.openOrders.length > 0){
      console.log('ORDER IS ALREADY ON THE BOOKS');
      return;
    }else{
      console.log('Placing Order...');
    }

    var orderbook = await this.getOrderBook();
    var topBid = parseFloat(orderbook.bids[0][0]);
    var topBid = marketData.bidPrice;

    var bidPrice = topBid - this.orderAdjustment;

    if(!this.TRADING_ENABLED){
      console.log('GDAX BOT: TRADING DISABLED');
      return
    }

    var now = moment();
    var elapsed = now.diff(this.lastTrade, 'seconds');

    if(elapsed < this.tradeWaitPeriod){
      var remaining = 60 - elapsed;
      console.log('Need to wait ' + remaining + ' seconds before making a trade');
      return;
    }

    const params = {
      price: bidPrice,
      size: this.minOrderSize,
      product_id: 'BTC-USD',
      time_in_force: 'GTT',
      cancel_after: 'hour'
    }

    authedClient.buy(params)
      .then(res => {
        console.log(res);

        // var order = {
        //   id: res.id,
        //   price: res.price,
        //   side: res.side
        // }
        //
        // this.openOrders.push(order);

        var trade_time = moment(time).local().format('YYYY-MM-DD HH:mm:ss');

        var payload = {
          time: trade_time,
          price: params.price,
          action: 'BUY',
          size: params.size,
          exchange: 'GDAX',
          pair: 'BTC_USD'
        }

        io.to('market_feed').emit('action', {
          type: 'bot_action',
          payload: payload
        });

        // this.saveOrder(payload);
      })
      .catch(err => {
        console.log(err);
      })
}

module.exports.executeSellOrder = async () => {

  var time = moment();

  if(this.openOrders.length > 0){
    console.log('TRIED TO SELL BUT THERE ARE ALREADY ORDERS ON THE BOOK');
    return;
  }else{
    console.log('Making Trade');
  }

  // var orderbook = await this.getOrderBook();

  // var lowestAsk = parseFloat(orderbook.asks[0][0]);
  var lowestAsk = marketData.askPrice;

  var askPrice = lowestAsk + this.orderAdjustment;

  if(!this.TRADING_ENABLED){
    console.log('GDAX BOT: TRADING DISABLED');
    return
  }

  var now = moment();
  var elapsed = now.diff(this.lastTrade, 'seconds');

  if(elapsed < this.tradeWaitPeriod){
    var remaining = 60 - elapsed;
    console.log('Need to wait ' + remaining + ' seconds before making a trade');
    return;
  }

  var params = {
    price: askPrice,
    size: this.minOrderSize,
    product_id: 'BTC-USD',
    time_in_force: 'GTT',
    cancel_after: 'hour'
  }

  authedClient.sell(params)
    .then(res => {
      console.log(res);

      // var order = {
      //   id: res.id,
      //   price: res.price,
      //   side: res.side
      // }
      //
      // this.openOrders.push(order);

      var trade_time = moment(time).format('YYYY-MM-DD HH:mm:ss');

      var payload = {
        time: trade_time,
        price: params.price,
        action: 'SELL',
        size: params.size,
        exchange: 'GDAX',
        pair: 'BTC_USD'
      }

      io.to('market_feed').emit('action', {
        type: 'bot_action',
        payload: payload
      });

      // this.saveOrder(payload);
    })
    .catch(err => {
      console.log(err);
    })
}

module.exports.getOrderBook = () => {
  // console.log('getting order book');

  var path = '/products/' + this.BTC_USD + '/book';

  var url = baseURI + path;

  return new Promise((fulfill, reject) => {
    axios.get(url, {
        params: {
          level: 1
        }
      })
      .then(res => {
        fulfill(res.data);
      })
      .catch(err => {
        console.log(err);
        reject(err);
      });
    })
}

// module.exports.saveOrder = async (payload) => {
//   const order = new Order({
//     order: payload.action,
//     time: payload.time.toString(),
//     size: payload.size,
//     price: payload.price,
//     exchange: payload.exchange,
//     pair: payload.pair
//   });
//
//   order.save()
//     .then(res => {
//       console.log('GDAX BOT: Market order saved to database');
//       // console.log('TYPE: ', payload.action);
//       return
//     })
//     .catch(err => {
//       console.log('GDAX BOT: Error saving order to mongodb');
//       console.log(err);
//       return
//     })
// }

module.exports.saveTrade = async (payload) => {
  const tradeData = payload.data;

  const trade = new Trade({
    order: payload.order,
    id: payload.id,
    time: payload.time,
    exchange: payload.exchange,
    trade: tradeData
  })

  trade.save()
    .then(res => {
      console.log('Trade saved to DB');
      return
    })
    .catch(err => {
      console.log(err);
      return
    })


}

module.exports.cancelAllOrders = async () => {
    console.log('Trading Bot: GDAX bot command cancel_all_orders');

    return authedClient.cancelAllOrders()
      .then(res => {
        console.log(res);
        this.openOrders.length = 0;

        return
      })
      .catch(err => {
        console.log(err);
        return err
      })
  }
