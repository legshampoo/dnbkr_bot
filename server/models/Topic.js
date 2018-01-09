const mongoose = require('mongoose');
const Schema = mongoose.Schema;

mongoose.Promise = global.Promise;

const validator = require('validator');
const mongodbErrorHandler = require('mongoose-mongodb-errors');
const passportLocalMongoose = require('passport-local-mongoose');

const topicSchema = new Schema({
  name: {
    type: String,
    unique: true,
    trim: true,
    required: 'Please Supply a topic'
  },
  created: {
    type: Date,
    default: Date.now
  },
  historicalData: [{
      time: Date,
      author: String,
      comment: String,
      sentiment: Number
  }]
});

topicSchema.pre('save', function(next){

  next();
})

//prettifies mongodb errors for better logging
topicSchema.plugin(mongodbErrorHandler);

module.exports = mongoose.model('Topic', topicSchema, 'Topic');
