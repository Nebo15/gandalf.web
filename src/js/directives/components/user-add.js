"use strict";

angular.module('app').controller('userAddController', function ($scope, _, $uibModalInstance, project, PROJECT_USER_SCOPES, ProjectUser, User, $q) {

  $scope.project = project;
  $scope.userSearch = null;
  $scope.user = new ProjectUser({
    role: 'manager'
  });
  $scope.scopes = PROJECT_USER_SCOPES;

  $scope.getUsers = _.throttle(function (str) {
    return User.find(null, null, {
      name: str
    }).then(function (resp) {
      return resp.data;
    });
  }, 300);

  $scope.openModal = function () {

  };
  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
  $scope.save = function (form) {
    if (form.$invalid) return;
    $scope.user.id = $scope.userSearch.id;

    $scope.project.addUser($scope.user).then(function () {
      $uibModalInstance.dismiss('cancel');
    });
  };
  $scope.remove = function () {
    $scope.user.remove().then(function () {
      return $scope.project.update();
    }).then(function () {
      $uibModalInstance.dismiss('cancel');
    });
  };

  $scope.isRequired = function () {
    return !(user.scope && user.scope.length > 0);
  };
});

angular.module('app').directive('userAdd', function ($uibModal) {
  return {
    restrict: 'EA',
    scope: {
      project: '=userAdd'
    },
    link: function (scope, el, attrs) {
      el.bind('click', function () {
        $uibModal.open({
          templateUrl: 'templates/modal/user-add.html',
          controller: 'userAddController',
          resolve: {
            project: function () {
              return scope.project;
            }
          }
        });
      })
    }
  };
});
