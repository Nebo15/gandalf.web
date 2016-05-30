"use strict";

angular.module('app').controller('userEditController', function ($scope, project, user, $uibModalInstance, currentUser, PROJECT_USER_SCOPES) {

  $scope.currentUser = currentUser;
  $scope.user = user; // from directive scope
  $scope.project = project; // from directive scope

  $scope.scopes = PROJECT_USER_SCOPES;
  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
  $scope.save = function (form) {
    if (form.$invalid) return;
    $scope.project.updateUser($scope.user).then(function () {
      $uibModalInstance.dismiss('cancel');
    });
  };

  $scope.remove = function () {
    $scope.project.removeUser($scope.user).then(function () {
      $uibModalInstance.dismiss('cancel');
    });
  };

  $scope.isRequired = function () {
    return !(user.scope && user.scope.length > 0);
  };
});

angular.module('app').directive('userEdit', function ($uibModal) {
  return {
    restrict: 'EA',
    scope: {
      project: '=userEdit',
      user: '=userEditModel'
    },
    link: function (scope, el, attrs) {
      el.bind('click', function () {
        $uibModal.open({
          templateUrl: 'templates/modal/user-edit.html',
          controller: 'userEditController',
          resolve: {
            project: function () {
              return scope.project;
            },
            user: function () {
              return scope.user;
            },
            currentUser: ['UserService', function (UserService) {
              return UserService.current();
            }]
          }
        });
      })
    }
  };
});
