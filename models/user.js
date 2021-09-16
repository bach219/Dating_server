var mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const confiq = require('../config/config').get(process.env.NODE_ENV);
const salt = 10;

var Schema = mongoose.Schema;

var UserSchema = new Schema({
  name: { type: String },
  email: { type: String },
  password: { type: String },
  gender: { type: String, enum: ['Nam', 'Nữ'], default: 'Nam' },
  birth: { type: Date },
  job: { type: String },
  company: { type: String },
  school: { type: String },
  address: { type: String },
  company: { type: String },
  height: { type: String },
  weight: { type: String },
  literacy: { type: String },
  description: { type: String },


  interestGender: { type: String },
  interestDistance: { type: String },
  interestAge: { type: String },
  interestHeight: { type: String },
  interestWeight: { type: String },
  interestLiteracy: { type: String },

});


// to signup a user
UserSchema.pre('save', function (next) {
  var user = this;

  if (user.isModified('password')) {
    bcrypt.genSalt(salt, function (err, salt) {
      if (err) return next(err);

      bcrypt.hash(user.password, salt, function (err, hash) {
        if (err) return next(err);
        user.password = hash;
        next();
      })

    })
  }
  else {
    next();
  }
});

//to login
UserSchema.methods.comparepassword = function (password, cb) {
  bcrypt.compare(password, this.password, function (err, isMatch) {
    if (err) return cb(next);
    cb(null, isMatch);
  });
}

// generate token

UserSchema.methods.generateToken = function (cb) {
  var user = this;
  var token = jwt.sign(user._id.toHexString(), confiq.SECRET);

  user.token = token;
  user.save(function (err, user) {
    if (err) return cb(err);
    cb(null, user);
  })
}

// find by token
UserSchema.statics.findByToken = function (token, cb) {
  var user = this;

  jwt.verify(token, confiq.SECRET, function (err, decode) {
    user.findOne({ "_id": decode, "token": token }, function (err, user) {
      if (err) return cb(err);
      cb(null, user);
    })
  })
};

//delete token

UserSchema.methods.deleteToken = function (token, cb) {
  var user = this;

  user.update({ $unset: { token: 1 } }, function (err, user) {
    if (err) return cb(err);
    cb(null, user);
  })
}
// Export model.
module.exports = mongoose.model('User', UserSchema);