// require('dotenv').config({ path: 'variables.env' });
// var logger = require('tracer').colorConsole();
// const moment = require('moment');
//
// const marketData = require('./gdax_market_feed');
//
// const Order = require('../../../models/Order');
//
// const Gdax = require('gdax');
//
// const gdax_orderbook = require('./gdax_orderbook');
// const gdax_bot_tests = require('./gdax_bot_tests');
//
// const key = process.env.GDAX_KEY;
// const secret = process.env.GDAX_SECRET;
// const passphrase = process.env.GDAX_PASSPHRASE;
// const baseURI = 'https://api.gdax.com';
//
// var TRADING_ENABLED = true;
//
// var prevBuyTime = moment().format('YYYY-DD-MM HH:mm:ss');
//
// const authedClient = new Gdax.AuthenticatedClient(
//   key,
//   secret,
//   passphrase,
//   baseURI
// );
//
// const publicClient = new Gdax.PublicClient('BTC-USD', baseURI);
//
// var io;
// var openOrders = [];
// //module.exports.openOrders = openOrders;
//
// var orderAdjustment = 0;  //use this for testing so the orders don't actually sell through
//
// // var bot = {
// module.exports = {
//
//   BTC_USD_PRICE: 0,
//
//   minimumOrderSize: 0.001,
//
//   openOrders: [],
//   // orderAdjustment: 300,
//
//   previousBuy: moment(),
//
//   previousSell: moment(),
//
//   tradeWaitTime: 0, //seconds
//
//   init: async (_io) => {
//     console.log('init gdax bot');
//
//     console.log('GDAX BOT: TRADING ENABLED: ', TRADING_ENABLED);
//
//     io = _io;
//
//     // gdax_bot_tests.checkTimeElapsed();
//
//     this.initHeartbeat();
//     // bot.getProducts();
//     this.initAccountInfo();
//
//     setInterval(() => {
//       this.adjustOpenOrders(io);
//     }, 5000);
//   },
//
//   getProducts: () => {
//     console.log('get products');
//     publicClient
//       .getProducts()
//       .then(res => {
//         console.log('get products: ');
//         console.log(res);
//       })
//       .catch(err => {
//         console.log(err);
//       })
//   },
//
//   initAccountInfo: () => {
//     var secInterval = 30;
//     this.getAccountInfo();
//
//     setInterval(() => {
//       this.getAccountInfo();
//     }, 1000 * secInterval);
//   },
//
//   tradingStatus: (status) => {
//     TRADING_ENABLED = status;
//
//     if(TRADING_ENABLED){
//       console.log('GDAX BOT: TRADING HAS BEEN ENABLED');
//     }else{
//       console.log('GDAX BOT: TRADING HAS BEEN DISABLED');
//     }
//   },
//
//   getAccountInfo: () => {
//     authedClient.getAccounts()
//       .then(res => {
//         var currentTime = moment().format('YYYY-MM-DD HH:mm:ss');
//         var accounts = {};
//
//         res.forEach((item, index) => {
//           var key = item.currency;
//           accounts[key] = item;
//         });
//
//         var payload = accounts;
//
//         io.to('market_feed').emit('action', {
//           type: 'account_status',
//           payload: payload
//         });
//       })
//       .catch(err => {
//         console.log(err);
//       });
//   },
//
//   getOpenOrders: () => {
//     // console.log('get gdax order');
//     return authedClient.getOrders({
//         status: 'open'
//       })
//       .then(res => {
//         // console.log(res);
//         return res
//       })
//       .catch(err => {
//         console.log(err);
//       })
//   },
//
//   adjustOpenOrders: async (io) => {
//     openOrders = await this.getOpenOrders();
//
//     // console.log('orders from gdax: ');
//     // console.log(orders);
//
//     if(openOrders.length > 0){
//       openOrders.forEach(async (order) => {
//         if(order.side === 'buy' && order.price < marketData.bidPrice){
//           console.log('cancel this order and make a new one at current bid');
//
//           this.cancelAllOrders()
//             .then(res => {
//               this.executeMarketBuy(io);
//             })
//             .catch(err => {
//               console.log(err);
//             })
//         }
//
//         if(order.side ==='sell' && order.price > marketData.askPrice){
//           console.log('cancel this sell order and make a new one at current ask');
//
//           this.cancelAllOrders()
//             .then(res => {
//               this.executeMarketSell(io);
//             })
//             .catch(err => {
//               console.log(err);
//             })
//         }
//       })
//     }
//   },
//
//   update: (payload) => {
//     console.log('bot command: ', payload.command);
//     console.log(payload);
//
//     var payload = {
//       exchange: 'GDAX',
//       pair: 'BTC_USD',
//       command: payload.command,
//       data: {
//         ...payload.data
//       }
//     };
//
//     io.to('market_feed').emit('action', {
//       type: 'bot_command',
//       payload: payload
//     });
//   },
//
//   initHeartbeat: () => {
//
//     setInterval(() => {
//       var payload = {
//         status: 'alive',
//         time: moment().format('YYYY-DD-MM HH:mm:ss'),
//         exchange: 'GDAX',
//         pair: 'BTC_USD',
//       };
//
//       io.to('market_feed').emit('action', {
//         type: 'bot_status',
//         payload: payload
//       });
//     }, 5000);
//   },
//
//   executeMarketBuy: async (io) => {
//     console.log('executing buy');
//     var time = moment();
//
//     var elapsed = time.diff(this.previousBuy, 'seconds');
//
//     // if(elapsed < bot.tradeWaitTime){
//     //   console.log('GDAX BOT: Wait ' + bot.tradeWaitTime + ' seconds before next trade');
//     //   return
//     // }else{
//     //   console.log('enough time has elapsed, ok to trade');
//     //   bot.previousBuy = time;
//     // }
//
//     if(openOrders.length > 0){
//       console.log('TRIED TO TRADE BUT THERE IS ALREADY AN ORDER ON THE BOOKS');
//       return;
//     }else{
//       console.log('no orders on books, ok to trade');
//     }
//
//     var orderbook = await gdax_orderbook.getOrderBook();
//     var topBid = parseFloat(orderbook.bids[0][0]);
//     // var bidPrice = topBid + .01;
//     var bidPrice = topBid - orderAdjustment;
//     // var bidPrice = topBid;
//
//     if(!TRADING_ENABLED){
//       console.log('GDAX BOT: TRADING DISABLED');
//       var trade_time = moment(time).local().format('YYYY-MM-DD MM:mm:ss');
//
//       var payload = {
//         action: 'NULL_BUY',
//         time: trade_time,
//         size: this.minimumOrderSize,
//         price: bidPrice,
//         exchange: 'GDAX',
//         pair: 'BTC_USD'
//       }
//
//       this.saveOrder(payload);
//
//       return
//     }
//
//     const params = {
//       price: bidPrice,
//       size: this.minimumOrderSize,
//       product_id: 'BTC-USD',
//       time_in_force: 'GTT',
//       cancel_after: 'min'
//     }
//
//     authedClient.buy(params)
//       .then(res => {
//         console.log(res);
//         // var tradeId = res.id;
//         // console.log('TRADE ID: ', tradeId);
//         //
//         // var tradeEntry = {
//         //   id: tradeId,
//         //   type: 'buy',
//         //   price: params.price
//         // }
//         //
//         // openOrders.push(tradeEntry);
//
//         var trade_time = moment(time).local().format('YYYY-MM-DD HH:mm:ss');
//
//         var payload = {
//           time: trade_time,
//           price: params.price,
//           action: 'BUY',
//           size: params.size,
//           exchange: 'GDAX',
//           pair: 'BTC_USD'
//         }
//
//         io.to('market_feed').emit('action', {
//           type: 'bot_action',
//           payload: payload
//         });
//
//         this.saveOrder(payload);
//
//       })
//       .catch(err => {
//         console.log(err);
//       })
//   },
//
//   saveOrder: async (payload) => {
//     const order = new Order({
//       order: payload.action,
//       time: payload.time.toString(),
//       size: payload.size,
//       price: payload.price,
//       exchange: payload.exchange,
//       pair: payload.pair
//     });
//
//     order.save()
//       .then(res => {
//         console.log('GDAX BOT: Market order saved to database');
//         console.log('TYPE: ', payload.action);
//         return
//       })
//       .catch(err => {
//         console.log('GDAX BOT: Error saving order to mongodb');
//         console.log(err);
//         return
//       })
//   },
//
//   executeMarketSell: async (io) => {
//     console.log('selling hre');
//     // var time = moment();
//
//     // var elapsed = time.diff(bot.previousSell, 'seconds');
//
//     // if(elapsed < bot.tradeWaitTime){
//     //   console.log('GDAX BOT: Wait ' + bot.tradeWaitTime + ' seconds before next trade');
//     //   return
//     // }else{
//     //   bot.previousSell = time;
//     // }
//     // console.log('length: ', openOrders.length);
//     // if(openOrders.length > 0){
//     //   console.log('TRIED TO SELL BUT THERE ARE ALREADY ORDERS ON THE BOOK');
//     //   return;
//     // }else{
//     //   console.log('ok to sell, no orders on book');
//     // }
//     //
//     // var orderbook = await gdax_orderbook.getOrderBook();
//     //
//     // var lowestAsk = parseFloat(orderbook.asks[0][0]);
//     //
//     // // var askPrice = lowestAsk - .01;
//     // var askPrice = lowestAsk + orderAdjustment;
//     // // var askPrice = lowestAsk;
//     //
//     // if(!TRADING_ENABLED){
//     //   console.log('GDAX BOT: TRADING DISABLED');
//     //
//     //   var trade_time = moment(time).local().format('YYYY-MM-DD HH:mm:ss');
//     //
//     //   var payload = {
//     //     action: 'NULL_SELL',
//     //     time: trade_time,
//     //     size: bot.minimumOrderSize,
//     //     price: askPrice,
//     //     exchange: 'GDAX',
//     //     pair: 'BTC_USD'
//     //   }
//     //
//     //   bot.saveOrder(payload);
//     //
//     //   return
//     // }
//     //
//     // var params = {
//     //   price: askPrice,
//     //   size: bot.minimumOrderSize,
//     //   product_id: 'BTC-USD',
//     //   time_in_force: 'GTT',
//     //   cancel_after: 'min'
//     // }
//     //
//     // authedClient.sell(params)
//     //   .then(res => {
//     //     // console.log('SELL RESPONSE: ');
//     //     console.log(res);
//     //     // var tradeId = res.id;
//     //     // console.log('TRADE ID: ', tradeId);
//     //     //
//     //     // var tradeEntry = {
//     //     //   id: tradeId,
//     //     //   type: 'sell',
//     //     //   price: params.price
//     //     // }
//     //     //
//     //     // openOrders.push(tradeEntry);
//     //
//     //     var trade_time = moment(time).format('YYYY-MM-DD HH:mm:ss');
//     //
//     //     var payload = {
//     //       time: trade_time,
//     //       price: params.price,
//     //       action: 'SELL',
//     //       size: params.size,
//     //       exchange: 'GDAX',
//     //       pair: 'BTC_USD'
//     //     }
//     //
//     //     io.to('market_feed').emit('action', {
//     //       type: 'bot_action',
//     //       payload: payload
//     //     });
//     //
//     //     bot.saveOrder(payload);
//     //   })
//     //   .catch(err => {
//     //     console.log(err);
//     //   })
//
//   },
//
//   cancelAllOrders: async () => {
//     console.log('Trading Bot: GDAX bot command cancel_all_orders');
//
//     return authedClient.cancelAllOrders()
//       .then(res => {
//         console.log('cancel order response: ');
//         console.log(res);
//         openOrders.length = 0;
//
//         return
//       })
//       .catch(err => {
//         console.log(err);
//         return err
//       })
//   }
//
//
// }
//
// // module.exports = bot;
