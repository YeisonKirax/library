'user strict';

var users = require('../../app/controllers/users.server.controller');
var passport = require('passport');

module.exports = function(app){
  //Configurar las rutas 'signup'
  app.route('/signup')
     .get(users.renderSignup)
     .post(users.signup);

  //Configurar las routes 'signin'
  app.route('/signin')
     .get(users.renderSignin)
     .post(passport.authenticate('local', {
       successRedirect: '/user',
       failureRedirect: '/signin',
       failureFlash: true
     }));
 //Configurar la route 'signout'
  app.get('/signout', users.signout);
  app.get('/user', users.dashboardUsuario);

  app.route('/api/usuarios')
  .get(users.list);

  app.route('/api/usuarios/:userId')
  .get(users.read)
  .put(users.update)
  .delete(users.delete, users.signout);

  app.param('userId', users.userByID);
};
