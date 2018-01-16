require('dotenv').config({ path: 'variables.env' });
const GTT = require('gdax-trading-toolkit');
const GTT_logger = GTT.utils.ConsoleLoggerFactory({
  level: 'info'
});
var logger = require('tracer').colorConsole();
const axios = require('axios');
const moment = require('moment');

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

const base = 'https://api.gdax.com';

var prev_longEMA = 0;
var prev_shortEMA = 0;

var prevEMA = 0;  //used as a temp var
var pollingRate = 60 * 1000;  //get from server every 60 seconds

var marketData = {
  init: async (io) => {

    console.log('Market Feed: init');

    marketData.initTickerFeed(io);
    marketData.initEMA(io);

  },

  initEMA: () => {
    marketData.updateEMA();  //one once to fill latest data

    setInterval(async (io) => {
      console.log('\n');
      console.log('---------------------------------')
      console.log('Getting market data from gdax...');
      marketData.updateEMA();
    }, pollingRate);
  },

  updateEMA: async () => {
    var historicalData = await marketData.getHistoricalData(BTC_USD, 1, 26);  //pair, minutes, numBins
    var longEMA = marketData.calculateEMA(historicalData, 26);  //intervals to calculate against
    var shortEMA = marketData.calculateEMA(historicalData, 9);
    marketData.applyLogic(longEMA, shortEMA);
  },

  calculateEMA: (data, intervals) => {
    var currentData = data[0];

    var currentTime = moment(currentData[0]).format('YYYY-MM-DD HH:mm:ss');
    var currentPrice = currentData[4];

    if(prevEMA === 0){
      prevEMA = marketData.calculateSimpleAverage(data, intervals);
    }

    var EMA = (currentPrice * (2 / (1 + intervals))) + (prevEMA * (1 - (2 / (1 + intervals))));

    return EMA;
  },

  applyLogic: (longEMA, shortEMA, io) => {
    var currentTime = moment().format('YYYY-MM-DD HH:mm:ss');

    if(prev_longEMA === 0 || prev_shortEMA === 0){
      logger.info('Market: first pass, storing previous market data')
      prev_longEMA = longEMA;
      prev_shortEMA = shortEMA;
      console.log('DO NOTHING');
      gdax_bot.update('DO_NOTHING');
      return
    }

    if(prev_shortEMA < prev_longEMA){
      if(shortEMA > longEMA){
        console.log('\n')
        console.log('Time: ', Date.now());
        console.log('Short EMA: ' + shortEMA + ' is now greater than ');
        console.log('Long EMA: ' + longEMA);
        console.log('BUY IT UP YO!');
        console.log('BUY IT UP YO!');
        console.log('BUY IT UP YO!');
        console.log('\n');

        // var currentTime = Date.now();
        var payload = {
          command: 'BUY',
          time: currentTime,
          data: {
            trend: 'begin trend up! buy buy buy',
            shortEMA: shortEMA,
            longEMA: longEMA
          }
        }

        gdax_bot.update(payload);

        //this is where we send to client and tell bot what to do
      }else{
        console.log('Market: Trending down, do nothing');
        var payload = {
          command: 'DO_NOTHING',
          time: currentTime,
          data: {
            trend: 'down, do nothing',
            shortEMA: shortEMA,
            longEMA: longEMA
          }
        }
        gdax_bot.update(payload);
      }
    }

    if(prev_shortEMA > prev_longEMA){
      // var currentTime = moment().format('YYYY-MM-DD HH:mm:ss');
      if(shortEMA < longEMA){
        console.log('\n');
        console.log('Time: ', currentTime);
        console.log('Short EMA: ' + shortEMA + ' is now less than ');
        console.log('Long EMA: ' + longEMA);
        console.log('SELL SELL SELL');
        console.log('\n');
        //this is where we send to client and tell bot what to do
        var payload = {
          command: 'SELL',
          time: currentTime,
          data: {
            trend: 'begin trend down',
            shortEMA: shortEMA,
            longEMA: longEMA
          }
        }
        gdax_bot.update(payload);
      }else{
        // console.log('Market: Trending up, HODL');
        var payload = {
          command: 'DO_NOTHING',
          time: currentTime,
          data: {
            trend: 'up, just HODL',
            shortEMA: shortEMA,
            longEMA: longEMA
          }
        }
        gdax_bot.update(payload);
      }
    }

    prev_shortEMA = shortEMA;
    prev_longEMA = longEMA;
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

  calculateSimpleAverage: (data, intervals) => {
    var total = 0;
    data.forEach((entry, index) => {
      if(index > intervals - 1){
        return;
      }

      total += entry[4];
    });

    var avg = total / intervals;

    return avg
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

  getHistoricalData: async (pair, binLength, numBins) => {
    //gets the historical data, binLength is in minutes
    //going back 26 intervals
    // console.log('Market: ', pair);
    logger.info('Market: Getting historical data for ' + pair + ' market on Gdax');

    const binSize = binLength * 60;

    const path = '/products/' + pair + '/candles';

    const url = base + path;

    var endDate = moment().utc();

    // var longHistory = (5 * 60) * 26;
    var numIntervals = binSize * numBins;
    var startDate = endDate.clone().subtract(numIntervals, 'seconds');

    // console.log('startDate: ', startDate);
    // console.log('  endDate: ', endDate);

    return new Promise((fulfill, reject) => {
      axios.get(url, {
        params: {
          start: startDate.toISOString(),
          end: endDate.toISOString(),
          granularity: binSize
        }
      })
        .then(res => {
          fulfill(res.data);
        })
        .catch(err => {
          console.log(err);
          reject(err);
        })
    });
  }  //end promise
}

module.exports = marketData;
