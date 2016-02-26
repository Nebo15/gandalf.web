'use strict';

angular.module('app').run(function ($rootScope, $state) {

  function annotatedStateObject(state, $current) {
    state = angular.extend({}, state);
    var resolveData = $current.locals.resolve.$$values;
    state.params = resolveData.$stateParams;
    state.resolve = angular.copy(resolveData);
    delete state.resolve.$stateParams;
    state.includes = $current.includes;
    return state;
  }


  function isAuthRequired (state) {
    return state.self.auth || state.parent && isAuthRequired(state.parent) || false;
  }

  $rootScope.$on('$stateChangeSuccess', function (e, toState) {

    toState = annotatedStateObject(toState, $state.$current);
    $rootScope.user = toState.resolve.user;

    var auth = isAuthRequired($state.$current);

    if (auth && toState.resolve.user == null) {
      $rootScope.$broadcast('login:required');
    }
  });

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
