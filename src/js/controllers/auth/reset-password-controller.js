
angular.module('app').controller('ResetPasswordController', function ($scope, $stateParams, $state, $gandalf) {
  $scope.sent = false;

  $scope.model = {
    email: $stateParams.email
  };

  $scope.submit = function (form) {
    if (form.$invalid) return;

    return $gandalf.admin.resetPassword($scope.model.email).then(function (resp) {
      var token = _.get(resp,'sandbox.reset_password_token.token');
      if (token) {
        $state.go('reset-password-confirm', {
          token: token
        })
      }
      $scope.sent = true;
    }).catch(function (error) {
      $scope.error = error.data.meta;
    })
  }
});
