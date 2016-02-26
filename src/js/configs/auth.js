
angular.module('app').config(function($stateProvider) {

  $stateProvider.state('auth', {
    abstract: true,
    resolve: {
      user: ['AuthService', function (AuthService) {
        return AuthService.signInFromStorage().catch(function () {
          return null;
        });
      }]
    }
  })

}).run(function ($rootScope, AuthService) {
  $rootScope.$on('$stateChangeStart', function (e, toState) {
    //if (!toState.auth) return;

    console.log(toState);
  });
});
