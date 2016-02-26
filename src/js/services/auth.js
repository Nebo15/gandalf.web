'use strict';

angular.module('app').service('AuthService', function ($gandalf, $localStorage) {

  var storage = $localStorage.$default({
    auth: {}
  });

  this.signIn = function (username, password) {
    return $gandalf.testAuthorization(username, password).then(function () {
      $gandalf.setAuthorization(username, password);
      storage.auth.username = username;
      storage.auth.password = password;
    })
  };
  this.signInFromStorage = function () {
    return this.signIn(storage.auth.username, storage.auth.password);
  };
});
