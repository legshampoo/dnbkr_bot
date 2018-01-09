
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;  //tell mongoose to use ES6 promises

const mongoTest = require('./mongoTest');

require('../models/User');
require('../models/Topic');
require('../handlers/passport');

var database = {
  init: () => {
    console.log('DATABASE: initializing connection...');

    mongoose.connect(process.env.DATABASE, {})
    .then(() => {
      console.log('DATABASE: Conected');
      // test();
    })
    .catch(err => {
      console.log(err);
    });

    mongoose.connection.on('error', (err) => {
      console.log('Mongoose connection error', err.message);
    });
  },

  test: () => {
    mongoTest.findOneAndUpdate();
  }

}

module.exports = database;
