
angular.module('app').config(function($stateProvider) {

  $stateProvider.state('auth', {
    abstract: true,
    template: '<ui-view />',
    resolve: {
      user: ['AuthService','$state','$rootScope','$q', function (AuthService, $state, $rootScope, $q) {
        console.log('auth resolve', $state.transition);
        return AuthService.signInFromStorage().then(function (resp) {
          $rootScope.user = resp;
          return resp;
        }).catch(function (resp) {
          if ($state.nextState.isAuthRequired) {
            return $q.reject(new Error('LoginRequired'));
          }
          return null;
        });
      }],
      //projects: ['Projects']
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
