'use strict';

angular.module('app').controller('SignInController', function ($scope, $state, $stateParams, AuthService) {

  $scope.model = {
    username: $stateParams.username,
    password: null
  };

  $scope.error = null;

  $scope.submit = function (form) {
    if (form.$invalid) return;

    AuthService.signIn($scope.model.username, $scope.model.password)
      .then(function () {
        $state.go('history-list');
      }).catch(function (error) {
      $scope.error = error;
    })
  }
});
