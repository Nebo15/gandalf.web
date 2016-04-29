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
    return $gandalf.setAuthorization(username, password).then(function (user) {
      storage.auth = user;
      console.log(storage.auth);
      return user;
    });
  };
  this.signUp = function (username, password, email) {
    return $gandalf.admin.createUser({
      username: username,
      password: password,
      email: email
    });
  };
  this.signInFromStorage = function () {
    return $gandalf.admin.checkToken(storage.auth).then(function (resp) {
      $gandalf.setToken(storage.auth);
      return storage.auth;
    });
  };

  this.logout = function () {
    console.log('logout');
    storage.auth = {};
    $gandalf.resetAuthorization();
  }
});
