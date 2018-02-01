'use strict';

var config = require('./config');
var mongoose = require('mongoose');

module.exports = function(){
  var db = mongoose.connect('mongodb://localhost/mean');
  require('../app/models/user.server.model');
  require('../app/models/book.server.model');


  return db;
};
