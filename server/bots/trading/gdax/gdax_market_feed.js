require('dotenv').config({ path: 'variables.env' });
const GTT = require('gdax-trading-toolkit');
const GTT_logger = GTT.utils.ConsoleLoggerFactory({
  level: 'info'
});
var logger = require('tracer').colorConsole();
const axios = require('axios');
const moment = require('moment');

const MACD = require('technicalindicators').MACD;
const SMA = require('technicalindicators').SMA;

const _macd = require('macd');


const gdax_bot = require('./gdax_bot');

const BTC_USD = 'BTC-USD';
const ETH_BTC = 'ETH-BTC';
const ETH_USD = 'ETH-USD';
const LTC_BTC = 'LTC-BTC';
const LTC_USD = 'LTC-USD';
const BCH_USD = 'BCH-USD';

const products = [BTC_USD];

const GDAXAuthConfig = {
  auth: {
    key: process.env.GDAX_KEY,
    secret: process.env.GDAX_SECRET,
    passphrase: process.env.GDAX_PASSPHRASE
  }
}

const base = process.env.GDAX_BASE;

var prev_longEMA = 0;
var prev_shortEMA = 0;

var prevEMA = 0;  //used as a temp var

const fastPeriod = 12;
const slowPeriod = 26;
const signalPeriod = 9;
const binDuration = 1;  //in minutes
const MACD_pollingRate = 10 * 1000;
var historicalData = [];

var marketData = {

  init: async (io) => {

    console.log('Market Feed: init');

    marketData.initDataFeeds(io);

  },

  initDataFeeds: (io) => {
    marketData.initTickerFeed(io);
    marketData.updateMACD(io);  //one once to fill latest data

    setInterval(() => {
      console.log('\n\n\n');
      console.log('Updating MACD');
      console.log('\n');
      marketData.updateMACD(io);
    }, MACD_pollingRate);
  },

  updateMACD: async (io) => {
    // console.log('getting historical data');

    var data = await marketData.getHistoricalData(BTC_USD, binDuration);  //pair, minutes

    marketData.emitHistoricalData(data, io);

    if(historicalData.length === 0){
      //if its the first pass, fill the whole array
      historicalData = data;
    }else{
      var currentTimeBlock = historicalData[0][0];
      var newTimeBlock = data[0][0];

      if(currentTimeBlock !== newTimeBlock){
        console.log('NEW DATA ADDED TO MACD');
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
    var TREND = '';

    if(previousHistogramValue < 0){
      if(histogramValue > 0){
        console.log('TREND: CHANGE - GOING UP - BUY');
        
        TRADE_DECISION = 'BUY';
        TREND = 'TURNING UP'

        gdax_bot.executeMarketBuy(io);
      }else{
        TRADE_DECISION = 'DO_NOTHING';
        TREND = 'DOWN';
      }
    }
    if(previousHistogramValue > 0){
      if(histogramValue < 0){
        console.log(moment().format('YYYY-MM-DD HH:mm:ss'));
        console.log('TREND: CHANGE - GOING DOWN - SELL');

        TRADE_DECISION = 'SELL';
        TREND = 'TURNING DOWN';

        gdax_bot.executeMarketSell(io);
      }else{
        TRADE_DECISION = 'DO NOTHING';
        TREND = 'UP';
      }
    }

    var currentTime = moment().format('YYYY-MM-DD HH:mm:ss');
    var price = gdax_bot.BTC_USD_PRICE;

    var payload = {
      time: currentTime,
      currentPrice: price,
      trade_decision: TRADE_DECISION,
      trend: TREND
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

    // console.log('emit historical data');

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

    GTT.Factories.GDAX.FeedFactory(GTT_logger, products, GDAXAuthConfig)
      .then((feed) => {
        feed.on('data', (msg) => {
          if(msg.type !== 'ticker'){
            return
          }

          var price = msg.origin.price;

          price = parseFloat(price).toFixed(2);

          gdax_bot.BTC_USD_PRICE = price;
          // console.log('PRICE: ', price);

          var payload = {
            exchange: 'GDAX',
            pair: BTC_USD,
            price: price
          };

          io.to('market_feed').emit('action', {
            type: 'market_feed',
            payload: payload
          });
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
    //gets the historical data, binLength is in minutes
    logger.info('Market: Getting historical data for ' + pair + ' market on Gdax');

    // const granularity = binLength * 60;  //binlength is in minutes
    const granularity = 60;

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
