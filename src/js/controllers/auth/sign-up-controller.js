'use strict';

angular.module('app').controller('SignUpController', function ($scope, $state, $stateParams, AuthService) {

  $scope.model = {
    username: $stateParams.username,
    password: null,
    email: $stateParams.email
  };

  $scope.error = null;

  $scope.submit = function (form) {
    if (form.$invalid) return;

    return AuthService.signUp($scope.model.username, $scope.model.password, $scope.model.email)
      .then(function () {
        return AuthService.signIn($scope.model.username, $scope.model.password)
      }).then(function () {
        $state.go('welcome-index');
      }).catch(function (error) {
        $scope.error = error;
      })
  }
});
