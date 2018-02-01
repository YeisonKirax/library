'use strict';
angular.module('users').controller('UsersController', ['$scope', '$routeParams','$window','$location', 'Authentication', 'Users', function($scope, $routeParams, $window, $location, Authentication, Users){
  $scope.authentication = Authentication;

  $scope.find = function(){
    $scope.users = Users.query();
  };
  $scope.findOne = function(){
    $scope.user = Users.get({
      userId: $routeParams.userId
    });
  };
  $scope.update = function(){
    $scope.user.$update(function(){
      $location.path('usuarios/' + $scope.user._id);
    }, function(errorResponse){
      $scope.error = errorResponse.data.message;
    });
  };
  $scope.delete = function(user){
    if(user){
      user.$remove(function(){
        for(var i in $scope.users){
          if($scope.users[i] === user){
            $scope.users.splice(i, 1);
          }
        }
      });
    }else{
      $scope.user.$remove(function(){
        $location.path('/');
      });
    }
  };

}]);
