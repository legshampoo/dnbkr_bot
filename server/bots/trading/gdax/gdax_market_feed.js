require('dotenv').config({ path: 'variables.env' });

// const gdax_bot = require('./gdax_bot');
const bot = require('./bot');

const GTT = require('gdax-trading-toolkit');
// import * as GTT = import('gdax')
//this is from tutorial file in node_modules/gdax-trading-toolkit/t002_liveOrderbook.js
var core_1 = require("gdax-trading-toolkit/build/src/core");

var printOrderbook = GTT.utils.printOrderbook;
// import * as GTT from 'gdax-trading-toolkit';
// import ('gdax-trading-toolkit');
const GTT_logger = GTT.utils.ConsoleLoggerFactory({
  level: 'info'
});
var logger = require('tracer').colorConsole();
const axios = require('axios');
const moment = require('moment');

const MACD = require('technicalindicators').MACD;
const SMA = require('technicalindicators').SMA;

const _macd = require('macd');

const BigNumber = require('bignumber.js');


// var openOrders = require('./gdax_bot').openOrders;

const BTC_USD = 'BTC-USD';
const ETH_BTC = 'ETH-BTC';
const ETH_USD = 'ETH-USD';
const LTC_BTC = 'LTC-BTC';
const LTC_USD = 'LTC-USD';
const BCH_USD = 'BCH-USD';

const base = process.env.GDAX_BASE;

const fastPeriod = 12;   //3
const slowPeriod = 26;   //5
const signalPeriod = 9;   //9
const MACD_pollingRate = 10 * 1000;
var historicalData = [];

var marketData = {

  binDuration: 5,  //candlestick duration

  highThreshold: 5,

  lowThreshold: -5,

  trend: '',

  bidPrice: 0,

  askPrice: 0,

  BTC_USD_PRICE: 0,

  init: async (io) => {

    console.log('Market Feed: init');

    bot.init(io);

    marketData.initDataFeeds(io);

  },

  initDataFeeds: (io) => {
    marketData.initTickerFeed(io);
    marketData.updateMACD(io);  //one once to fill latest data

    setInterval(() => {
      // console.log('\n\n\n');
      console.log('Updating MACD');
      // console.log('\n');
      marketData.updateMACD(io);
    }, MACD_pollingRate);
  },

  updateMACD: async (io) => {
    // console.log('getting historical data');

    var data = await marketData.getHistoricalData(BTC_USD, marketData.binDuration);  //pair, minutes

    marketData.emitHistoricalData(data, io);

    if(historicalData.length === 0){
      //if its the first pass, fill the whole array
      historicalData = data;
    }else{
      var currentTimeBlock = historicalData[0][0];
      var newTimeBlock = data[0][0];

      if(currentTimeBlock !== newTimeBlock){
        // console.log('NEW DATA ADDED TO MACD');
        historicalData.unshift(data[0]);
      }else{
        //do nothing, no new data
        // console.log('no new data yet');
      }
    }

    var values = [];
    var times = [];
    historicalData.forEach((item) => {
      var close = item[4];
      var convertedDate = new Date(0);
      convertedDate.setUTCSeconds(item[0]);
      var time = moment(convertedDate).local().format('YYYY-MM-DD HH:mm:ss:SS');

      times.push(time);
      values.push(close);
    })

    values.reverse();

    var macdInput = {
      values: values,
      fastPeriod: fastPeriod,
      slowPeriod: slowPeriod,
      signalPeriod: signalPeriod,
      SimpleMAOscillator: false,
      SimpleMASignal: false
    }

    var macd = MACD.calculate(macdInput);

    var payload = {
      exchange: 'GDAX',
      pair: BTC_USD,
      macd: macd
    };

    marketData.decision(macd, io);

    io.to('market_feed').emit('action', {
      type: 'macd',
      payload: payload
    });

  },

  decision: (macd, io) => {
    var previousHistogramValue = macd[macd.length - 2].histogram;
    var histogramValue = macd[macd.length - 1].histogram;

    var TRADE_DECISION = '';
    // var TREND = '';

    if(previousHistogramValue < marketData.lowThreshold){
      if(histogramValue > marketData.lowThreshold){
        console.log('TREND: CHANGE - GOING UP - BUY');

        TRADE_DECISION = 'BUY';
        marketData.trend = 'UP';

        bot.executeBuyOrder();
      }else{
        TRADE_DECISION = 'DO_NOTHING';
        marketData.trend  = 'DOWN';
      }
    }
    if(previousHistogramValue > marketData.highThreshold){
      if(histogramValue < marketData.highThreshold){
        console.log(moment().format('YYYY-MM-DD HH:mm:ss'));
        console.log('TREND: CHANGE - GOING DOWN - SELL');

        TRADE_DECISION = 'SELL';
        marketData.trend = 'DOWN';

        bot.executeSellOrder();
      }else{
        TRADE_DECISION = 'DO NOTHING';
        marketData.trend = 'UP';
      }
    }

    var currentTime = moment().format('YYYY-MM-DD HH:mm:ss');

    var price = marketData.BTC_USD_PRICE;

    var payload = {
      time: currentTime,
      currentPrice: price,
      trade_decision: TRADE_DECISION,
      trend: marketData.trend
    }

    io.to('market_feed').emit('action', {
      type: 'trade_decision',
      payload: payload
    })
  },

  emitHistoricalData: (d, io) => {
    var values = [];
    d.forEach((item) => {
      var convertedDate = new Date(0);
      convertedDate.setUTCSeconds(item[0]);
      var time = moment(convertedDate).local().format('YYYY-MM-DD HH:mm:ss:SS');

      var entry = {
        time: time,
        low: item[1],
        high: item[2],
        open: item[3],
        close: item[4],
        volume: item[5]
      }
      values.push(entry);
    });

    //-----
    //  NEED TO REVERSE DATA FOR RECHARTS
    //-----
    values.reverse();

    var payload = {
      exchange: 'GDAX',
      pair: BTC_USD,
      historicalData: values
    };

    io.to('market_feed').emit('action', {
      type: 'historical_data',
      payload: payload
    });
  },

  getGdaxServerTime: () => {
    const path = '/time';
    const url = base + path;

    return new Promise((fulfill, reject) => {
      axios.get(url)
        .then(res => {
          var iso = res.data.iso;
          var epoch = res.data.epoch;

          var serverTime = moment(iso).format('YYYY-MM-DD HH:mm:ss');

          fulfill(serverTime);
        })
        .catch(err => {
          reject(err);
        })
    })
  },

  initTickerFeed: (io) => {
    GTT_logger.info('GDAX Market Feed Init');

    const GDAXAuthConfig = {
      auth: {
        key: process.env.GDAX_KEY,
        secret: process.env.GDAX_SECRET,
        passphrase: process.env.GDAX_PASSPHRASE
      }
    }

    const products = [BTC_USD];

    GTT.Factories.GDAX.FeedFactory(GTT_logger, products, GDAXAuthConfig)
      .then((feed) => {

        const LiveBookConfig = {
          product: BTC_USD,
          logger: GTT_logger
        }

        const book = new core_1.LiveOrderbook(LiveBookConfig);

        book.on('LiveOrderbook.snapshot', function(){
          logger.log('info', 'Snapshot received by LiveOrderbook');

          setInterval(() => {
            console.log('calculating high/low bids');
            var bids = book.ordersForValue('sell', 100, false);
            var asks = book.ordersForValue('buy', 100, false);
            var bigNumberBid = new BigNumber(bids[0].orders[0].price);
            var bigNumberAsk = new BigNumber(asks[0].orders[0].price);

            marketData.bidPrice = bigNumberBid.toNumber();
            marketData.askPrice = bigNumberAsk.toNumber();

            console.log(marketData.bidPrice);

          }, 3000);
        });

        book.on('LiveOrderbook.trade', function (trade) {
          logger.log('book.on LiveOrderbook.trade');
          logger.log('bot open orders: ', bot.openOrders);
          if(typeof bot.openOrders === 'undefined'){
            return
          }

          if(bot.openOrders.length > 0){
            var makerId = trade.origin.maker_order_id;
            var takerId = trade.origin.taker_order_id;
            // console.log('Open Orders: ');
            bot.openOrders.forEach(order => {
              if(makerId === order.id || takerId === order.id){
                console.log('\n\n');
                console.log('TRADE SETTLED: ', order.id);
                console.log('SIDE: ', order.side);
                console.log('PRICE: ', order.price);
                console.log('\n\n');

                console.log('MY ORDER DETAILS =======');
                console.log(order);
                bot.lastTrade = moment();
                console.log('----------TRADE data');
                console.log(trade);
                console.log('type of trade: ', order.side);

                // var order = order.side;
                var time = moment().local().format('YYYY-MM-DD HH:mm:ss');
                var exchange = 'GDAX';

                var payload = {
                  order: order.side,
                  id: order.id,
                  time: time,
                  exchange: exchange,
                  data: trade
                }

                bot.saveTrade(payload);
              }
            })
          }
        });

        feed.pipe(book);

        feed.on('data', (msg) => {
          // logger.log('feed got data');
          if(msg.type === 'ticker'){
            logger.log('new ticker price');
            var price = msg.origin.price;

            price = parseFloat(price).toFixed(2);

            marketData.BTC_USD_PRICE = price;
            // console.log('PRICE: ', price);

            var payload = {
              exchange: 'GDAX',
              pair: BTC_USD,
              price: marketData.BTC_USD_PRICE
            };

            io.to('market_feed').emit('action', {
              type: 'market_feed',
              payload: payload
            });
          }
        })
      })
      .catch((err) => {
        GTT_logger.log('error', err.message);
      })
  },

  getAllProducts: async () => {
    console.log('getting all products');
    const path = '/products';
    const url = base + path;

    return new Promise((fulfill, reject) => {
      axios.get(url)
        .then(res => {
          console.log('=========RES=========');
          console.log(res.data);
        })
        .catch(err => {
          console.log(err);
        })
    })
  },

  getHistoricalData: async (pair, binLength) => {
    logger.log('getting historical data');
    const granularity = binLength * 60;  //binlength is in minutes

    const path = '/products/' + pair + '/candles';

    const url = base + path;

    // var endDate = moment().utc();
    // var historyLength = 26 * granularity;
    // var startDate = endDate.clone().subtract(historyLength, 'seconds');

    return new Promise((fulfill, reject) => {
      axios.get(url, {
          params: {
            // start: startDate.toISOString(),
            // end: endDate.toISOString(),
            granularity: granularity
          }
        })
        .then(res => {
          fulfill(res.data);
        })
        .catch(err => {
          console.log(err);
          reject(err);
        });
    });
  }  //end promise
}

module.exports = marketData;
