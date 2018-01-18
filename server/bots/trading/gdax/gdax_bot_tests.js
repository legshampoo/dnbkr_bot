
// const axios = require('axios');
const moment = require('moment');
// const base = 'https://api.gdax.com';
// const BTC_USD = 'BTC-USD';
// var previousBuy = moment();

const botTests = {

  previousBuy: moment(),

  // tradeDebounceTime: moment.duration(3, 'seconds'),

  checkTimeElapsed: () => {
    console.log('gdax bot test TimeElapsed');

    setTimeout(() => {
      var time = moment();
      console.log('time: ', time);
      console.log('previous buy: ', botTests.previousBuy);

      // var elapsed = time.subtract(previousBuy, 'seconds');
      var elapsed = time.diff(botTests.previousBuy, 'seconds');
      //
      console.log('elapsed: ', elapsed);

      // if(moment(elapsed).isAfter(botTests.tradeDebounceTime, 'seconds')){
      if(elapsed > 3){
        console.log('enough time has passed');
      }else{
        console.log('not enough time has passed')
      }

    }, 2000);

  }
}

module.exports = botTests;
