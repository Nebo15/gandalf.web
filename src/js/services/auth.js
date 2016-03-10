'use strict';

angular.module('app').run(function ($rootScope, $state) {

  function isAuthRequired (state) {
    return state.self.auth || state.parent && isAuthRequired(state.parent) || false;
  }

  $rootScope.$on('$stateChangeStart', function (e, toState, toStateParams, fromState, fromStateParams) {
    $state.nextState = toState.$$state();
    $state.nextState.isAuthRequired = isAuthRequired($state.nextState);
  });
  $rootScope.$on('$stateChangeError', function (e, toState, toStateParams, fromState, fromStateParams, error) {
    console.log('$stateChangeError', error);
    if (error.message == "LoginRequired") {
      console.log('login required');
      $rootScope.$broadcast('login:required');
    }
  })

}).service('AuthService', function ($gandalf, $localStorage) {

  var storage = $localStorage.$default({
    auth: {}
  });

  this.signIn = function (username, password) {
    return $gandalf.testAuthorization(username, password).then(function () {
      $gandalf.setAuthorization(username, password);
      storage.auth.username = username;
      storage.auth.password = password;
      return true;
    });
  };
  this.signInFromStorage = function () {
    return this.signIn(storage.auth.username, storage.auth.password);
  };

  this.logout = function () {
    storage.auth = {};
    $gandalf.resetAuthorization();
  }
});
