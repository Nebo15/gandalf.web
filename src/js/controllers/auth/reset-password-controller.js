
angular.module('app').controller('ResetPasswordController', function ($scope, $stateParams, $gandalf) {
  $scope.sent = false;

  $scope.model = {
    email: $stateParams.email
  };

  $scope.submit = function (form) {
    if (form.$invalid) return;

    return $gandalf.admin.resetPassword($scope.model.email).then(function (resp) {
      $scope.sent = true;
    }).catch(function (error) {
      $scope.error = error.data.meta;
    })
  }
});
