"use strict";

angular.module('app').controller('userAddController', function ($scope, _, $uibModalInstance, project, $alert, PROJECT_USER_SCOPES, ProjectUser, User, $q, $validate) {

  $scope.project = project;
  $scope.userSearch = null;
  $scope.user = new ProjectUser({
    role: 'manager'
  });
  $scope.scopes = PROJECT_USER_SCOPES;

  $scope.searchUsers = null;
  $scope.isEmail = function (value) {
    return $validate.validate('email', value);
  };
  $scope.shouldInvite = function (query) {
    return !($scope.searchUsers && $scope.searchUsers.length) && $scope.isEmail(query);
  };
  $scope.getUsers = _.throttle(function (str) {
    return User.find(null, null, {
      name: str
    }).then(function (resp) {
      $scope.searchUsers = resp.data;
      return resp.data;
    }, function () {
      $scope.searchUsers = [];
      return [];
    })
  }, 300);

  $scope.openModal = function () {

  };
  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
  $scope.save = function (form) {
    if (form.$invalid) return;

    var promise = $q.resolve();
    if ($scope.shouldInvite($scope.userSearch)) {
      $scope.user.email = $scope.userSearch;
      promise = $scope.project.inviteUser($scope.user).then(function (resp) {
        return $alert({
          title: 'Invitation letter have been sent',
          text: "User will receive invitation letter on email"
        }).then(function () {
          return resp;
        })
      })
    } else {
      $scope.user.id = $scope.userSearch.id;
      promise = $scope.project.addUser($scope.user);
    }

    return promise.then(function () {
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
