'use strict';

angular.module('app').run(function ($rootScope, $state, $stateParams, $log, AuthService) {
  function isAuthRequired (state) {
    return state.self.auth || state.parent && isAuthRequired(state.parent) || false;
  }

  $rootScope.$on('$stateChangeStart', function (e, toState, toStateParams, fromState, fromStateParams) {
    $state.nextState = toState.$$state();
    $state.nextState.isAuthRequired = isAuthRequired($state.nextState);
  });
  $rootScope.$on('$stateChangeError', function (e, toState, toStateParams, fromState, fromStateParams, error) {
    $log.log('$stateChangeError', error, e);
    e.preventDefault();

    if (error.message == "LoginRequired") {
      $rootScope.$broadcast('login:required');
    }
  });

  $rootScope.$on('$gandalfError', function (e, data) {
    if (data.status === 401) {
      AuthService.logout();
      $rootScope.$broadcast('login:required');
    }
    //if (data.status == 404) {
    //  AuthService.logout();
    //  $rootScope.$broadcast('login:required');
    //}
  });

  AuthService.signInFromStorage();

}).service('AuthService', function ($gandalf, $localStorage, $rootScope, $cacheFactory) {

  var storage = $localStorage.$default({
    auth: {}
  });

  $gandalf.setToken(storage.auth);

  this.signIn = function (username, password) {
    return $gandalf.setAuthorization(username, password).then(function (user) {
      storage.auth = user;
      storage.$apply();
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
    return $gandalf.setToken(storage.auth);
    //return $gandalf.admin.checkToken(storage.auth).then(function (resp) {
    //  $gandalf.setToken(storage.auth);
    //  return resp;
    //});
  };

  this.logout = function () {
    storage.auth = {};
    $rootScope.$broadcast('userDidLogout');
    $gandalf.resetAuthorization();
  };

  // local testing of authentication
  this.isAuthenticated = function () {
    return !!storage.auth.access_token;
  };

});
