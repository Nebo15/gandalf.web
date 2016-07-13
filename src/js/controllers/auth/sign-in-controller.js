'use strict';

angular.module('app').controller('SignInController', function ($scope, $state, $filter, $stateParams, AuthService) {

  $scope.model = {
    username: $stateParams.username,
    password: null
  };

  $scope.errorCode = $stateParams.errorCode;
  $scope.error = null;
  $scope.message = $stateParams.message;

  $scope.translateErrorCode = function (code) {
    var str = 'error_codes.' + code;
    var translate = $filter('translate')(str);
    return str == translate ? null : translate;
  };


  $scope.submit = function (form) {
    if (form.$invalid) return;

    $scope.message = null;

    AuthService.signIn($scope.model.username, $scope.model.password).then(function () {
      $state.go('tables-list');
    }).catch(function (error) {
      $scope.error = error;
    })
  }
});
