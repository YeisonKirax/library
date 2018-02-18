'user strict';

var controller = require('../../app/controllers/controller');

var passport = require('passport');

module.exports = function(app){
  app.get('/', controller.indexRender);

// ############################ Rutas usuarios ########################
  //Configurar las rutas 'signup'
  app.route('/signup')
     .get(controller.renderSignup)
     .post(controller.signup);

  //Configurar las routes 'signin'
  app.route('/signin')
     .get(controller.renderSignin)
     .post(passport.authenticate('local', {
       successRedirect: '/user',
       failureRedirect: '/signin',
       failureFlash: true
     }));
 //Configurar la route 'signout'
  app.get('/signout', controller.signout);
  app.get('/user', controller.dashboardUsuario);
  app.get('/user/edit/:userId', controller.userEdit);
  app.get('/user/:userId', controller.userView)

  app.route('/api/usuarios')
  .get(controller.userList);

  app.route('/user/edit/:userId')
  .get(controller.userEdit);

  app.route('/api/usuarios/:userId')
  .get(controller.userRead)
  .put(controller.userUpdate)
  .delete(controller.userDelete);
//#############################################################################################

//####################### Rutas libros#####################
  app.route('/books/edit/:bookId')
  .get(controller.bookEditView)
  app.route('/books/create')
  .get(controller.bookCreateView)
  app.route('/api/books')
  .get(controller.bookList)
  .post(controller.bookCreate);

  app.route('/api/books/:bookId')
  .put(controller.bookUpdate)
  .delete(controller.bookDelete);


  app.param('userId', controller.userByID);
  app.param('bookId', controller.bookByID);
};
