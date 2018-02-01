'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');
var SALT_WORK_FACTOR = 10;
var UserSchema = new Schema({
  username: {
    type: String

  },
  provider:{
    type: String
  },
  password: {
      type: String
  },
  created: {
    type: Date,
    default: Date.now
  }
});
UserSchema.pre('save', function(next) {
    const usuario = this;
    if (!usuario.isModified('password')) {
        return next();
    }

    bcrypt.genSalt(10, function (err, salt) {
        if (err) {
            next(err);
        }
        bcrypt.hash(usuario.password, salt, null, function (err, hash) {
            if (err) {
                next(err);
            }
            usuario.password = hash;
            next();
        });
    });
});

UserSchema.methods.compararPassword = function(password, cb) {
    bcrypt.compare(password, this.password, function (err, sonIguales) {
        if(err) {
            return cb(err);
        }
        cb(null, sonIguales);
    })
};


mongoose.model('User', UserSchema);
