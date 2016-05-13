"use strict";

angular.module('app').controller('userEditController', function ($scope, $uibModal, PROJECT_USER_SCOPES) {

  var modalInstance = null;
  //$scope.user = null; // from directive scope
  //$scope.project = null; // from directive scope

  $scope.scopes = PROJECT_USER_SCOPES;

  $scope.openModal = function () {
    console.log('open modal');
    modalInstance = $uibModal.open({
      templateUrl: 'templates/modal/user-edit.html',
      scope: $scope
    });
  };
  $scope.cancel = function () {
    if (!modalInstance) return;
    modalInstance.dismiss('cancel');
  };
  $scope.save = function (form) {
    if (form.$invalid) return;
    $scope.project.updateUser($scope.user).then(function () {
      modalInstance.dismiss('cancel');
    });
  };
  $scope.remove = function () {
    $scope.project.removeUser($scope.user).then(function () {
      modalInstance.dismiss('cancel');
    });
  }
});

angular.module('app').directive('userEdit', function () {
  return {
    restrict: 'EA',
    controller: 'userEditController',
    scope: {
      project: '=userEdit',
      user: '=userEditModel'
    },
    link: function (scope, el, attrs) {
      el.bind('click', function () {
        scope.openModal();
      })
    }
  };
});
