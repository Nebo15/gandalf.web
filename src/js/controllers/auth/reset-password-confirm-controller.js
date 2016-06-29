
angular.module('app').controller('ResetPasswordConfirmController', function ($scope, $stateParams, $state, $gandalf) {

  $scope.model = {
    token: $stateParams.token,
    password: null
  };

  $scope.submit = function (form) {
    if (form.$invalid) return;
    return $gandalf.admin.resetPasswordConfirm($scope.model.token, $scope.model.password).then(function (resp) {
      $state.go('sign-in', {
        message: 'You have successfully reset your password.'
      });
    });
  };
});
