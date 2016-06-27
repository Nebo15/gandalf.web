"use strict";

angular.module('app').controller('userEditController', function ($scope, _, $q, project, user, $uibModalInstance, currentUser, PROJECT_USER_SCOPES) {

  $scope.currentUser = _.find(project.users, {id: currentUser.id});
  $scope.user = user; // from directive scope
  $scope.project = project; // from directive scope

  $scope.scopes = PROJECT_USER_SCOPES;
  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };

  var userRole = user.role;
  $scope.save = function (form) {
    if (form.$invalid) return;

    var promise = $q.resolve(true);
    if ($scope.user.role == 'admin' && userRole !== 'admin') {
      promise = $scope.project.setUserAdminRights($scope.user);
    }

    return promise.then(function () {
      return $scope.project.updateUser($scope.user);
    }).then(function () {
      $uibModalInstance.dismiss('cancel');
    });
  };

  $scope.removeError = null;
  $scope.remove = function () {
    $scope.project.removeUser($scope.user).then(function () {
      $uibModalInstance.dismiss('cancel');
    }).catch(function (resp) {
      $scope.removeError = resp;
    })
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
