'use strict';
angular.module('users').config(['$routeProvider', function($routeProvider){
  $routeProvider.
  when('/usuarios/:userId',{
    templateUrl: 'users/views/view-user.client.view.html'
  }).
  when('/usuarios/:userId/edit',{
    templateUrl: 'users/views/edit-user.client.view.html'
  });

}]);
