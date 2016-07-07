
angular.module('app').directive('profileEdit', function ($uibModal) {
  return {
    restrict: 'AE',
    scope: {
      user: '=profileEdit'
    },
    link: function (scope, el, attrs) {
      el.bind('click', function () {
        $uibModal.open({
          templateUrl: 'templates/modal/profile-edit.html',
          controller: 'profileEditController',
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

angular.module('app').controller('profileEditController', function ($scope, user, User, $uibModalInstance) {

  $scope.user = user.copy();
  $scope.password = null;

  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
  $scope.save = function (form) {
    if (form.$invalid) return;

    $scope.user.update($scope.password).then(function () {
      user.constructor($scope.user);
      $uibModalInstance.dismiss('cancel');
    });
  };
});
