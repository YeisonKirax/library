'use strict';
angular.module('users').factory('Users', ['$resource', function($resource){
  return $resource('api/usuarios/:userId',{
    userId: '@_id'
  },{
    update: {
      method: 'PUT'
    }
  });
}]);
