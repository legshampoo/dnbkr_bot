const mongoose = require('mongoose');
const Schema = mongoose.Schema;

mongoose.Promise = global.Promise;

const validator = require('validator');
const mongodbErrorHandler = require('mongoose-mongodb-errors');
// const passportLocalMongoose = require('passport-local-mongoose');

const tradeSchema = new Schema({
  order: {
    type: String,
    required: true
  },
  id: {
    type: String,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  exchange: {
    type: String,
    required: true
  },
  trade: {
    type: Object,
    required: true
  }
});

tradeSchema.pre('save', function(next){
  var self = this;

  next();
})

tradeSchema.pre('findOneAndUpdate', function(next){
  var self = this;


  next();
})

//prettifies mongodb errors for better logging
tradeSchema.plugin(mongodbErrorHandler);

module.exports = mongoose.model('Trade', tradeSchema, 'Trade');
