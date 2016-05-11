
angular.module('app').config(function($stateProvider) {

  $stateProvider.state('auth', {
    abstract: true,
    template: '<ui-view />',
    resolve: {
      user: ['AuthService','$state','$rootScope','$q', function (AuthService, $state, $rootScope, $q) {
        return AuthService.signInFromStorage().then(function (resp) {
          return resp.data;
        }).catch(function () {
          if ($state.nextState.isAuthRequired) {
            return $q.reject(new Error('LoginRequired'));
          }
          return null;
        });
      }]
    },
    ncyBreadcrumb: {
      skip: true
    }
  });

}).run(function ($rootScope, $state, $timeout, AuthService) {

  $rootScope.$on('login:required', function () {
    console.log('login');
    $timeout(function () {
      $state.go('sign-in');
    })
  });

  $rootScope.logout = function () {
    AuthService.logout();
    $state.go('sign-in');
  }
});
