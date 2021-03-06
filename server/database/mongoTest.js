const moment = require('moment');
const Topic = require('../models/Topic');
const Trade = require('../models/Trade');

var utils = {

  findOneAndUpdate: () => {

    console.log('DEV: running test query on mongo');

    var topic = 'ETH';
    var comment = {
      created_utc: 0000000,
      author: 'Author Name',
      comment: 'this is the comment'
    }
    var query = { name: topic };

    var options = {
      $push: {
        historicalData: {
          time_utc: comment.created_utc,
          author: comment.author.name,
          comment: comment.body,
          sentiment: 0
        }
      }
    };

    Topic.findOneAndUpdate(query, options)
    .select({
      name: 1,
      _id: 0
    })
    .then(res => {
      console.log('TEST QUERY RESPONSE: ');
      console.log(res);
    })
    .catch(err => {
      console.log(err);
    });
  },

  saveDuplicateData: () => {
    console.log('mongoTest.saveDuplicateData()');

    var topic = 'TEST_TOPIC';

    var unixTimeStamp = 1515724669;
    var convertedDate = new Date(0);
    convertedDate.setUTCSeconds(unixTimeStamp);
    // var testDate = new Date('2017-01-01T00:00:01Z');
    var time_utc = moment(convertedDate).utc().format('YYYY-MM-DD HH:mm:ss:SSZ');
    time_utc = time_utc.toString();

    var query = { name: topic };

    var options = {
      $addToSet: {
        historicalData: {
          time_utc: time_utc,
          author: 'author name',
          comment: 'this is the test comment',
          sentiment: 0
        }
      }
    }

    Topic.findOneAndUpdate(query, options, {new: true})
      .then(res => {
        console.log('Test find and update response: ');
        console.log(res);
      })
      .catch(err => {
        console.log(err);
      })
  },

  returnLatestEntry: () => {
    var topic = 'TEST_TOPIC';
    var query = { name: topic };

    var options = {
      $addToSet: {
        historicalData: {
          time_utc: 'time_utc22222',
          author: 'comment.author.name',
          comment: 'comment.body',
          sentiment: 0
        }
      }
    };

    Topic.findOneAndUpdate(query, options, {
        new: true,
      })
      // .select({
      //   name: 1,
      //   _id: 0,
      //   historicalData: 1
      // })
      // .select({ "historicalData": { "$slice": -1 }})
      .select({
        _id: 0,
        created: 0,
        historicalData: {
           $slice: -1
         }
       })
      .then(res => {
        console.log('TEST_TOPIC RES: ');
        console.log(res);

      })
      .catch(err => {
        console.log(err);
      });
  },

  saveOrder: async () => {
    console.log('TEST SAVE ORDER');
    var time = moment().format('YYYY-MM-DD HH:mm:ss');

    var payload = {
      action: 'TEST_ORDER',
      time: time.toString(),
      size: .00000001,
      price: 00000,
      exchange: 'Exchange',
      pair: 'Pair'
    }

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

  }

}

module.exports = utils;
