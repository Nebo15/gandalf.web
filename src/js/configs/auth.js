
angular.module('app').config(function($stateProvider) {

  $stateProvider.state('auth', {
    abstract: true,
    template: '<ui-view />',
    resolve: {
      user: ['AuthService', function (AuthService) {
        console.log('auth resolve');
        return AuthService.signInFromStorage().then(function (resp) {
          console.log('auth', resp);
          return resp;
        }).catch(function (resp) {
          console.log('error auth', resp);
          return null;
        });
      }]
    }
  })

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
