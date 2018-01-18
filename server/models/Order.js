const mongoose = require('mongoose');
const Schema = mongoose.Schema;

mongoose.Promise = global.Promise;

const validator = require('validator');
const mongodbErrorHandler = require('mongoose-mongodb-errors');
// const passportLocalMongoose = require('passport-local-mongoose');

const orderSchema = new Schema({
  order: {
    type: String,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  size: {
    type: Number,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  exchange: {
    type: String,
    required: true
  },
  pair: {
    type: String,
    required: true
  }
});

orderSchema.pre('save', function(next){
  var self = this;

  next();
})

orderSchema.pre('findOneAndUpdate', function(next){
  var self = this;


  next();
})

//prettifies mongodb errors for better logging
orderSchema.plugin(mongodbErrorHandler);

module.exports = mongoose.model('Order', orderSchema, 'Order');
