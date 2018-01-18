// require('dotenv').config({ path: 'variables.env' });
// const GTT = require('gdax-trading-toolkit');
// const GTT_logger = GTT.utils.ConsoleLoggerFactory({
//   level: 'info'
// });
// var logger = require('tracer').colorConsole();
// const axios = require('axios');
// const moment = require('moment');
//
// const MACD = require('technicalindicators').MACD;
// const SMA = require('technicalindicators').SMA;
//
// const _macd = require('macd');
//
//
// const gdax_bot = require('./gdax_bot');
//
// const BTC_USD = 'BTC-USD';
// const ETH_BTC = 'ETH-BTC';
// const ETH_USD = 'ETH-USD';
// const LTC_BTC = 'LTC-BTC';
// const LTC_USD = 'LTC-USD';
// const BCH_USD = 'BCH-USD';
//
// const products = [BTC_USD];
//
// const GDAXAuthConfig = {
//   auth: {
//     key: process.env.GDAX_KEY,
//     secret: process.env.GDAX_SECRET,
//     passphrase: process.env.GDAX_PASSPHRASE
//   }
// }
//
// const base = process.env.GDAX_BASE;
//
// var prev_longEMA = 0;
// var prev_shortEMA = 0;
//
// var prevEMA = 0;  //used as a temp var
//
// const fastPeriod = 12;
// const slowPeriod = 26;
// const signalPeriod = 9;
// const binDuration = 5;  //in minutes
// // const numBins = 26;
// // var pollingRate = binDuration * (60 * 1000);  //get from server every 60 seconds
// const MACD_pollingRate = 30 * 1000;
//
// var marketData = {
//   init: async (io) => {
//
//     console.log('Market Feed: init');
//
//     marketData.initTickerFeed(io);
//     marketData.initMACD(io);
//
//   },
//
//   initMACD: (io) => {
//     marketData.updateMACD(io);  //one once to fill latest data
//
//     setInterval(() => {
//       console.log('\n');
//       console.log('---------------------------------')
//       console.log('Getting market data from gdax...');
//       marketData.updateMACD(io);
//     }, MACD_pollingRate);
//   },
//
//   updateMACD: async (io) => {
//     console.log('getting historiacl data');
//     var historicalData = await marketData.getHistoricalData(BTC_USD, binDuration);  //pair, minutes, numBins
//     // console.log(historicalData);
//
//     // console.log(historicalData);
//     var values = [];
//     historicalData.forEach(item => {
//       var close = item[4];
//       values.push(close);
//     });
//
//     console.log('LAST CLOSE: ', values[0]);
//
//     var macdInput = {
//       values: values,
//       fastPeriod: fastPeriod,
//       slowPeriod: slowPeriod,
//       signalPeriod: signalPeriod,
//       SimpleMAOscillator: false,
//       SimpleMASignal: false
//     }
//
//     // var macdInput = {
//     //   values            : [127.75,129.02,132.75,145.40,148.98,137.52,147.38,139.05,137.23,149.30,162.45,178.95,200.35,221.90,243.23,243.52,286.42,280.27],
//     //   fastPeriod        : 5,
//     //   slowPeriod        : 8,
//     //   signalPeriod      : 3 ,
//     //   SimpleMAOscillator: false,
//     //   SimpleMASignal    : false
//     // }
//
//     // historicalData = historicalData.slice(0, 320);
//     var macd = MACD.calculate(macdInput);
//
//     Object.keys(macd).forEach((key, index) => {
//       var convertedDate = new Date(0);
//       convertedDate.setUTCSeconds(historicalData[index][0]);
//       var time_utc = moment(convertedDate).utc().format('YYYY-MM-DD HH:mm:ss:SS');
//       macd[key].time = time_utc;
//     });
//     //
//     var payload = {
//       exchange: 'GDAX',
//       pair: BTC_USD,
//       macd: macd
//     };
//     //
//     // // console.log('emit: ', payload);
//     console.log('emit-------------------');
//     console.log(payload);
//
//     io.to('market_feed').emit('action', {
//       type: 'macd',
//       payload: payload
//     });
//   },
//
//   // applyLogic: (longEMA, shortEMA, io) => {
//   //   var currentTime = moment().format('YYYY-MM-DD HH:mm:ss');
//   //
//   //   if(prev_longEMA === 0 || prev_shortEMA === 0){
//   //     logger.info('Market: first pass, storing previous market data')
//   //     prev_longEMA = longEMA;
//   //     prev_shortEMA = shortEMA;
//   //     console.log('DO NOTHING');
//   //     gdax_bot.update('DO_NOTHING');
//   //     return
//   //   }
//   //
//   //   if(prev_shortEMA < prev_longEMA){
//   //     if(shortEMA > longEMA){
//   //       console.log('\n')
//   //       console.log('Time: ', Date.now());
//   //       console.log('Short EMA: ' + shortEMA + ' is now greater than ');
//   //       console.log('Long EMA: ' + longEMA);
//   //       console.log('BUY IT UP YO!');
//   //       console.log('BUY IT UP YO!');
//   //       console.log('BUY IT UP YO!');
//   //       console.log('\n');
//   //
//   //       // var currentTime = Date.now();
//   //       var payload = {
//   //         command: 'BUY',
//   //         time: currentTime,
//   //         data: {
//   //           trend: 'begin trend up! buy buy buy',
//   //           shortEMA: shortEMA,
//   //           longEMA: longEMA
//   //         }
//   //       }
//   //
//   //       gdax_bot.update(payload);
//   //       gdax_bot.executeMarketBuy();
//   //
//   //       //this is where we send to client and tell bot what to do
//   //     }else{
//   //       console.log('Market: Trending down, do nothing');
//   //       var payload = {
//   //         command: 'DO_NOTHING',
//   //         time: currentTime,
//   //         data: {
//   //           trend: 'down, do nothing',
//   //           shortEMA: shortEMA,
//   //           longEMA: longEMA
//   //         }
//   //       }
//   //       gdax_bot.update(payload);
//   //     }
//   //   }
//   //
//   //   if(prev_shortEMA > prev_longEMA){
//   //     // var currentTime = moment().format('YYYY-MM-DD HH:mm:ss');
//   //     if(shortEMA < longEMA){
//   //       console.log('\n');
//   //       console.log('Time: ', currentTime);
//   //       console.log('Short EMA: ' + shortEMA + ' is now less than ');
//   //       console.log('Long EMA: ' + longEMA);
//   //       console.log('SELL SELL SELL');
//   //       console.log('\n');
//   //       //this is where we send to client and tell bot what to do
//   //       var payload = {
//   //         command: 'SELL',
//   //         time: currentTime,
//   //         data: {
//   //           trend: 'begin trend down',
//   //           shortEMA: shortEMA,
//   //           longEMA: longEMA
//   //         }
//   //       }
//   //       gdax_bot.update(payload);
//   //       gdax_bot.executeMarketSell();
//   //     }else{
//   //
//   //       var payload = {
//   //         command: 'DO_NOTHING',
//   //         time: currentTime,
//   //         data: {
//   //           trend: 'up, just HODL',
//   //           shortEMA: shortEMA,
//   //           longEMA: longEMA
//   //         }
//   //       }
//   //       gdax_bot.update(payload);
//   //     }
//   //   }
//   //
//   //   prev_shortEMA = shortEMA;
//   //   prev_longEMA = longEMA;
//   // },
//
//   getGdaxServerTime: () => {
//     const path = '/time';
//     const url = base + path;
//
//     return new Promise((fulfill, reject) => {
//       axios.get(url)
//         .then(res => {
//           var iso = res.data.iso;
//           var epoch = res.data.epoch;
//
//           var serverTime = moment(iso).format('YYYY-MM-DD HH:mm:ss');
//
//           fulfill(serverTime);
//         })
//         .catch(err => {
//           reject(err);
//         })
//     })
//   },
//
//   initTickerFeed: (io) => {
//     GTT_logger.info('GDAX Market Feed Init');
//
//     GTT.Factories.GDAX.FeedFactory(GTT_logger, products, GDAXAuthConfig)
//       .then((feed) => {
//         feed.on('data', (msg) => {
//           if(msg.type !== 'ticker'){
//             return
//           }
//
//           var price = msg.origin.price;
//
//           price = parseFloat(price).toFixed(2);
//
//           gdax_bot.BTC_USD_PRICE = price;
//
//           var payload = {
//             exchange: 'GDAX',
//             pair: BTC_USD,
//             price: price
//           };
//
//           io.to('market_feed').emit('action', {
//             type: 'market_feed',
//             payload: payload
//           });
//         })
//       })
//       .catch((err) => {
//         GTT_logger.log('error', err.message);
//       })
//   },
//
//   getAllProducts: async () => {
//     console.log('getting all products');
//     const path = '/products';
//     const url = base + path;
//
//     return new Promise((fulfill, reject) => {
//       axios.get(url)
//         .then(res => {
//           console.log('=========RES=========');
//           console.log(res.data);
//         })
//         .catch(err => {
//           console.log(err);
//         })
//     })
//   },
//
//   getHistoricalData: async (pair, binLength) => {
//     //gets the historical data, binLength is in minutes
//     logger.info('Market: Getting historical data for ' + pair + ' market on Gdax');
//
//     const granularity = binLength * 60;  //binlength is in minutes
//
//     const path = '/products/' + pair + '/candles';
//
//     const url = base + path;
//
//     var endDate = moment().utc();
//     var historyLength = 26 * granularity;
//     var startDate = endDate.clone().subtract(historyLength, 'seconds');
//
//     return new Promise((fulfill, reject) => {
//       axios.get(url, {
//           params: {
//             // start: startDate.toISOString(),
//             // end: endDate.toISOString(),
//             granularity: granularity
//           }
//         })
//         .then(res => {
//           fulfill(res.data);
//         })
//         .catch(err => {
//           console.log(err);
//           reject(err);
//         });
//     });
//   }  //end promise
// }
//
// module.exports = marketData;
