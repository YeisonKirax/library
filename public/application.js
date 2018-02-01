var mainApplicationModuleName = 'mean';
var mainApplicationModule = angular.module(mainApplicationModuleName, ['ngResource','ngRoute','users','index','books']);

mainApplicationModule.config(['$locationProvider','$qProvider', function($locationProvider, $qProvider){
  $locationProvider.hashPrefix('!');
  $qProvider.errorOnUnhandledRejections(false);
}]);

angular.element(document).ready(function(){
  angular.bootstrap(document, [mainApplicationModuleName]);
});
