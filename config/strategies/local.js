// Invocar modo JavaScript 'strict'
'use strict';

// Cargar las dependencias de módulos
var passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    User = require('mongoose').model('User');

// Crear la estrategia local del método de configuración
module.exports = function() {
    // Usar la estrategia local de Passport
    passport.use(new LocalStrategy(function (username, password, done) {
        User.findOne({username: username}, function (err, user){
            if (!user) {
                return done(null, false, {message: 'Este usuario: '+ username + ' no esta registrado'});
            } else {
                user.compararPassword(password,function (err, sonIguales){
                    if (sonIguales) {
                        return done(null, user);
                    } else {
                        return done(null, false, {message: 'La contraseña no es válida'});
                    }
                })
            }
        })
    }));
};
