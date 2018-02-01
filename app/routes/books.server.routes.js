'use strict';
var users = require('../../app/controllers/users.server.controller');
var books = require('../../app/controllers/book.server.controller');
module.exports = function (app){
  app.route('/api/books')
  .get(books.list)
  .post(books.create);

  app.route('/api/books/:bookId')
  .get(books.read)
  .put(books.update)
  .delete(books.delete);

  app.param('bookId', books.bookByID);
};
