'use strict';
var mongoose = require('mongoose');
var User = mongoose.model('User');
var Book = mongoose.model('Book');
var passport = require('passport');

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
var getErrorMessage2 = function(err) {
  // Definir la variable de error message
  var message = '';

  // Si un error interno de MongoDB ocurre obtener el mensaje de error
  if (err.code) {
    switch (err.code) {
      // Si un eror de index único ocurre configurar el mensaje de error
      case 11000:
      case 11001:
        message = 'Usuario ya existe';
        break;
      // Si un error general ocurre configurar el mensaje de error
      default:
        message = 'Se ha producido un error';
    }
  } else {
    // Grabar el primer mensaje de error de una lista de posibles errores
    for (var errName in err.errors) {
      if (err.errors[errName].message) message = err.errors[errName].message;
    }
  }

  // Devolver el mensaje de error
  return message;
};
exports.indexRender = function(req, res){
  if(req.session.lastVisit){
    console.log(req.session.lastVisit);
  }
  req.session.lastVisit = new Date();

  res.render('index', {

    user:JSON.stringify(req.user)
  });
};

//################# CRUD LIBRO #############################
exports.bookCreateView = function(req, res){
  res.render('bookCreate', {
    title: "Biblioteca",
    user:JSON.stringify(req.user)
  });
};
exports.bookEditView = function(req, res){
  let libroId = req.params.bookId
  Book.findById(libroId, (err, libro) =>{
    if(err) res.status(500).send({message: 'Error al encontrar el libro'})
    if(!libro) res.status(400).send({message: 'Libro no existe'})
    res.render('bookEdit', {
      title: "Biblioteca",
      libro: libro,
      user:JSON.stringify(req.user)
    });
  })

};
exports.bookCreate = function(req, res){
  var book = new Book(req.body);
  book.save(function(err){
    if(err){
      return res.status(400).send({
        message: getErrorMessage(err)
      });
    }else{
      res.render('user',{
        user: JSON.stringify(req.user),
        title: "Biblioteca"
      });
    }
  });
};
exports.bookList = function(req, res){
  Book.find().exec(function(err, books){
    if(err){
      return res.status(400).send({
        message: getErrorMessage(err)
      });
    }else{
      res.render('bookList',{
        user: JSON.stringify(req.user),
        title: "Biblioteca",
        books: books
      })
    }
  });
};
exports.bookRead = function(req, res){
  res.json(req.book);
};
exports.bookUpdate = function(req, res){
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
      res.render('user',{
        user: JSON.stringify(req.user),
        title: "Biblioteca"
      });
    }
  });
};
exports.bookDelete = function(req, res){
  let libroId = req.params.bookId
  Book.remove({_id: libroId}, (err, libro) =>{
    if(err) res.status(500).send({message: 'Error al borrar el libro'})
    if(!libro) res.status(400).send({message: 'Libro no encontrado'})

    res.render('user',{
      title: "Biblioteca",
      user: JSON.stringify(req.user)
    })

  })

}
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
//################################################################
//################## CRUD USER #################################
exports.userView = function (req, res){
  res.render('userView', {
    title: "Biblioteca",
    id: req.user._id,
    username: req.user.username,
    user: JSON.stringify(req.user)
  })
}

exports.userEdit = function (req, res){
  let userId = req.params.userId
  User.findById(userId, (err, user) =>{
    if(err) res.status(500).send({message: 'Error al encontrar el libro'})
    if(!user) res.status(400).send({message: 'Libro no existe'})
    res.render('userEdit', {
      title: "Biblioteca",
      user: user
    });
  })
}

exports.dashboardUsuario = function(req, res) {
    res.render('user', {
        title: "Biblioteca",
        id: req.user._id,
        username: req.user.username,
        user: JSON.stringify(req.user)
    });
};
// Crear un nuevo método controller que renderiza la página signin
exports.renderSignin = function(req, res, next) {
  // Si el usuario no está conectado renderizar la página signin, en otro caso redireccionar al usuario de vuelta a la página principal de la aplicación
  if (!req.user) {
    // Usa el objeto 'response' para renderizar la página signin
    res.render('signin', {
      // Configurar la variable title de la página
      title: 'Sign-in Form',
      // Configurar la variable del mensaje flash
      messages: req.flash('error') || req.flash('info')
    });
  } else {
    return res.redirect('/user');
  }
};

// Crear un nuevo método controller que renderiza la página signup
exports.renderSignup = function(req, res, next) {
  // Si el usuario no está conectado renderizar la página signin, en otro caso redireccionar al usuario de vuelta a la página principal de la aplicación
  if (!req.user) {
    // Usa el objeto 'response' para renderizar la página signup
    res.render('signup', {
      // Configurar la variable title de la página
      title: 'Sign-up Form',
      // Configurar la variable del mensaje flash
      messages: req.flash('error')
    });
  } else {
    return res.redirect('/user');
  }
};

// Crear un nuevo método controller que crea nuevos users 'regular'
exports.signup = function(req, res, next) {
  // Si user no está conectado, crear y hacer login a un nuevo usuario, en otro caso redireccionar el user de vuelta a la página de la aplicación principal
  if (!req.user) {
    // Crear una nueva instancia del modelo 'User'
    var user = new User(req.body);
    var message = null;

    // Configurar la propiedad user provider
    user.provider = 'local';

    // Intenta salvar el nuevo documento user
    user.save(function(err) {
      // Si ocurre un error, usa el mensaje flash para reportar el error
      if (err) {
        // Usa el método de manejo de errores para obtener el mensaje de error
        var message = getErrorMessage2(err);

        // Configura los mensajes flash
        req.flash('error', message);

        // Redirecciona al usuario de vuelta a la página signup
        return res.redirect('/signup');
      }

      // Si el usuario fue creado de modo correcto usa el método 'login' de Passport para hacer login
      req.login(user, function(err) {
        // Si ocurre un error de login moverse al siguiente middleware
        if (err) return next(err);

        // Redireccionar al usuario de vuelta a la página de la aplicación principal
        return res.redirect('/user');
      });
    });
  } else {
    return res.redirect('/');
  }
};

// Crear un nuevo método controller para signing out
exports.signout = function(req, res) {
  // Usa el método 'logout' de Passport para hacer logout
  req.logout();

  // Redirecciona al usuario de vuelta a la página de la aplicación principal
  res.redirect('/');
};

// Crear un nuevo método controller list

exports.userList = function(req, res){
  User.find().exec(function(err, users){
    if(err){
      return res.status(400).send({
        message: getErrorMessage2(err)
      });
    }else{
      res.json(users)
    }
  });
};

exports.userRead = function(req, res){
  res.json(req.user);
};

exports.userUpdate = function(req, res){
  var user = req.user;
  user.username = req.body.username;
  user.password = req.body.password;
  user.save(function(err){
    if(err){
      return res.status(400).send({
        message: getErrorMessage2(err)
      });
    }else{
      res.json(user);
    }
  });
};
exports.userDelete = function(req, res){
  let userId = req.params.userId
  User.remove({_id: userId}, (err, user) =>{
    if(err) res.status(500).send({message: 'Error al borrar usuario'})
    if(!user) res.status(400).send({message: 'Usuario no encontrado'})

    req.logout();

    // Redirecciona al usuario de vuelta a la página de la aplicación principal
    res.redirect('/');

  })
};
exports.userByID = function(req, res, next, id){
  User.findById(id).exec(function(err, user){
    if (err){
      return next(err);
    }
    if(!user){
      return next(new Error('Fallo al cargar el usuario ' + id));
    }
    req.user = user;
    next();
  });
};
