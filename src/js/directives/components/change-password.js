
angular.module('app').directive('changePassword', function ($uibModal) {
  return {
    restrict: 'AE',
    scope: {
      user: '=changePassword'
    },
    link: function (scope, el, attrs) {
      el.bind('click', function () {
        $uibModal.open({
          templateUrl: 'templates/modal/change-password.html',
          controller: 'changePasswordController',
          resolve: {
            user: function () {
              return scope.user
            }
          }
        });
      })
    }
  };
});

angular.module('app').controller('changePasswordController', function ($scope, user, $uibModalInstance) {
  $scope.error = null;

  $scope.oldPassword = null;
  $scope.newPassword = null;

  $scope.save = function (form) {
    if (form.$invalid) return;

    $scope.error = null;

    user.update($scope.oldPassword, $scope.newPassword).then(function () {
      $uibModalInstance.dismiss('done');
    }).catch(function (error) {
      $scope.error = error;
    });
  };
});
