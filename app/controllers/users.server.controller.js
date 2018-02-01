'use strict';
var mongoose = require('mongoose');
var User = mongoose.model('User');
var passport = require('passport');

// Crear un nuevo método controller manejador de errores
var getErrorMessage = function(err) {
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
        var message = getErrorMessage(err);

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

exports.list = function(req, res){
  User.find().exec(function(err, users){
    if(err){
      return res.status(400).send({
        message: getErrorMessage(err)
      });
    }else{
      res.json(users)
    }
  });
};

exports.read = function(req, res){
  res.json(req.user);
};

exports.update = function(req, res){
  var user = req.user;
  user.username = req.body.username;
  user.password = req.body.password;
  user.save(function(err){
    if(err){
      return res.status(400).send({
        message: getErrorMessage(err)
      });
    }else{
      res.json(user);
    }
  });
};
exports.delete = function(req, res){
  var user = req.user;
  user.remove(function(err){
    if(err){
      return res.status(400).send({
        message: getErrorMessage(err)
      });
    }else{
      res.json(user);
    }
  });
};
exports.userByID = function(req, res, next, id){
  User.findById(id).exec(function(err, user){
    if (err){
      return next(err);
    }
    if(!user){
      return next(new Error('Fallo al cargar el libro ' + id));
    }
    req.user = user;
    next();
  });
};
