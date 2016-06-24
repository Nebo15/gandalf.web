
angular.module('app').config(function($stateProvider) {

  $stateProvider.state('auth', {
    abstract: true,
    template: '<ui-view />',
    resolve: {
      // check user auth login. eg., token exists
      auth: ['AuthService','$state','$q', function (AuthService, $state, $q) {
        if (AuthService.isAuthenticated()) return true;
        if ($state.nextState.isAuthRequired) {
          return $q.reject(new Error('LoginRequired'));
        }
        return false;
      }]
    }
  });

}).run(function ($rootScope, $state, $timeout, AuthService) {

  $rootScope.$on('login:required', function () {
    $timeout(function () {
      $state.go('sign-in', {
        errorCode: 401
      });
    })
  });

  $rootScope.logout = function () {
    AuthService.logout();
    $state.go('sign-in');
  }
});
