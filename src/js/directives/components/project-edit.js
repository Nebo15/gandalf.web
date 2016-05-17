"use strict";

angular.module('app').controller('projectEditController', function ($scope, project, $uibModalInstance) {

  $scope.project = angular.copy(project); // from directive scope
  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
  $scope.save = function (form) {
    if (form.$invalid) return;
    project.update($scope.project).then(function () {
      $uibModalInstance.dismiss('cancel');
    });
  };
  $scope.remove = function () {
    $scope.project.removeUser($scope.user).then(function () {
      $uibModalInstance.dismiss('cancel');
    });
  }
});

angular.module('app').directive('projectEdit', function ($uibModal) {
  return {
    restrict: 'EA',
    scope: {
      project: '=projectEdit'
    },
    link: function (scope, el, attrs) {
      el.bind('click', function () {
        $uibModal.open({
          templateUrl: 'templates/modal/project-edit.html',
          controller: 'projectEditController',
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
