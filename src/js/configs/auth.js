
angular.module('app').config(function($stateProvider) {

  $stateProvider.state('auth', {
    abstract: true,
    template: '<ui-view />',
    resolve: {
      user: ['AuthService','$state','$rootScope', function (AuthService, $state, $rootScope) {
        console.log('auth resolve', $state.transition);
        return AuthService.signInFromStorage().then(function (resp) {
          console.log('auth', resp);
          $rootScope.user = resp;
          return resp;
        }).catch(function (resp) {
          console.log('error auth', resp);
          if ($state.nextState.isAuthRequired) {
            return new Error('LoginRequired');
          }

          return null;
        });
      }]
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
