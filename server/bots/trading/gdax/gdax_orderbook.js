
const axios = require('axios');

const base = 'https://api.gdax.com';
const BTC_USD = 'BTC-USD';

const orderBook = {
  init: () => {
    console.log('init orderbook');
  },

  getOrderBook: () => {
    console.log('getting order book');

    var path = '/products/' + BTC_USD + '/book';

    var url = base + path;

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
}

module.exports = orderBook;
