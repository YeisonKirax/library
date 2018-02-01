'use strict';
var mongoose = require('mongoose');
var Book = mongoose.model('Book');

var getErrorMessage = function(err){
  if(err.errors){
    for(var errName in err.errors){
      if(err.errors[errName].message){
        return err.errors[errName].message;
      }
    }
  }else{
    return 'Error de servidor desconocido';
  }
};
exports.create = function(req, res){
  var book = new Book(req.body);
  book.save(function(err){
    if(err){
      return res.status(400).send({
        message: getErrorMessage(err)
      });
    }else{
      res.json(book);
    }
  });
};
exports.list = function(req, res){
  Book.find().exec(function(err, books){
    if(err){
      return res.status(400).send({
        message: getErrorMessage(err)
      });
    }else{
      res.json(books)
    }
  });
};
exports.read = function(req, res){
  res.json(req.book);
};
exports.update = function(req, res){
  var book = req.book;
  book.codigo = req.body.codigo;
  book.titulo = req.body.titulo;
  book.descripcion = req.body.descripcion;
  book.autor = req.body.autor;
  book.rama = req.body.rama;

  book.save(function(err){
    if(err){
      return res.status(400).send({
        message: getErrorMessage(err)
      });
    }else{
      res.json(book);
    }
  });
};
exports.delete = function(req, res){
  var book = req.book;
  book.remove(function(err){
    if(err){
      return res.status(400).send({
        message: getErrorMessage(err)
      });
    }else{
      res.json(book);
    }
  });
};
exports.bookByID = function(req, res, next, id){
  Book.findById(id).exec(function(err, book){
    if (err){
      return next(err);
    }
    if(!book){
      return next(new Error('Fallo al cargar el libro ' + id));
    }
    req.book = book;
    next();
  });
};
