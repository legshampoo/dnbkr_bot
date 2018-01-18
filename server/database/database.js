
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;  //tell mongoose to use ES6 promises
var logger = require('tracer').colorConsole();

const mongoTest = require('./mongoTest');

require('../models/User');
require('../models/Topic');
require('../models/Order');

require('../handlers/passport');

var database = {
  init: () => {
    logger.log('DATABASE: initializing connection...');

    mongoose.connect(process.env.DATABASE, {})
      .then(() => {
        logger.log('DATABASE: Connected to mongodb');
        //run mongo test here
        // database.test();
        //
      })
      .catch(err => {
        console.log(err);
      });

    mongoose.connection.on('error', (err) => {
      logger.error('Mongoose connection error', err.message);
    });
  },

  test: () => {
    // mongoTest.findOneAndUpdate();
    // mongoTest.saveDuplicateData();
    // mongoTest.returnLatestEntry();
    mongoTest.saveOrder();
  }

}

module.exports = database;
