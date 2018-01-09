const mongoose = require('mongoose');
const Schema = mongoose.Schema;

mongoose.Promise = global.Promise;

const md5 = require('md5');
const validator = require('validator');
const mongodbErrorHandler = require('mongoose-mongodb-errors');
const passportLocalMongoose = require('passport-local-mongoose');

const bcrypt = require('bcrypt');

const userSchema = new Schema({
  email: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true,
    validate: [validator.isEmail, 'Invalid Email Address'],
    required: 'Please Supply an Email Address'
  },
  name: {
    type: String,
    required: 'Please Supply a Name',
    trim: true
  },
  hash: {
    type: String,
    required: true
  }
});

userSchema.pre('save', function(next){

  var user = this;

  if(!user.isModified('hash')){
    console.log('PASSWORD HASH: hashing not required, password hasnt changed');
    return next();
  }

  const SALT_WORK_FACTOR = 10;

  console.log('PASSWORD HASH: Hashing Password...');
  bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt){
    if(err){
      return next(err);
    }

    //has the password using our new salt
    bcrypt.hash(user.hash, salt, function(err, hash){
      if(err){
        return next(err);
      }

      user.hash = hash;
      next();
    })
  })
})

userSchema.methods.validPassword = function(pwd, cb){
  bcrypt.compare(pwd, this.hash, function(err, isMatch){
    if(err){
      console.log('PASSWORD VALIDATION: Compare password error');
      return cb(err);
    }

    console.log('PASSWORD VALIDATION: Passwords match')
    return cb(null, isMatch);

  });
}

//prettifies mongodb errors for better logging
userSchema.plugin(mongodbErrorHandler);

module.exports = mongoose.model('User', userSchema, 'User');
