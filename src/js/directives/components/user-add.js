"use strict";

angular.module('app').controller('userAddController', function ($scope, $uibModal, PROJECT_USER_SCOPES, ProjectUser, User, $q) {

  var modalInstance = null;
  //$scope.project = null; // from directive scope
  //$scope.userSearch = null;

  $scope.userSearch = null;
  $scope.user = new ProjectUser({
    role: 'manager'
  });
  $scope.scopes = PROJECT_USER_SCOPES;

  $scope.getUsers = function (str) {
    return User.find(null, null, {
      name: str
    }).then(function (resp) {
      return resp.data;
    });
  };
  $scope.openModal = function () {
    modalInstance = $uibModal.open({
      templateUrl: 'templates/modal/user-add.html',
      scope: $scope
    });
  };
  $scope.cancel = function () {
    if (!modalInstance) return;
    modalInstance.dismiss('cancel');
  };
  $scope.save = function (form) {
    if (form.$invalid) return;
    $scope.user.id = $scope.userSearch.id;

    $scope.project.addUser($scope.user).then(function () {
      modalInstance.dismiss('cancel');
    });
  };
  $scope.remove = function () {
    $scope.user.remove().then(function () {
      return $scope.project.update();
    }).then(function () {
      modalInstance.dismiss('cancel');
    });
  }
});

angular.module('app').directive('userAdd', function () {
  return {
    restrict: 'EA',
    controller: 'userAddController',
    scope: {
      project: '=userAdd'
    },
    link: function (scope, el, attrs) {
      el.bind('click', function () {
        scope.openModal();
      })
    }
  };
});
