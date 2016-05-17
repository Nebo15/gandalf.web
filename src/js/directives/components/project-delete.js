"use strict";

angular.module('app').controller('projectDeleteController', function ($scope, $state, project, $uibModalInstance, ProjectsService) {

  $scope.project = angular.copy(project); // from directive scope
  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
  $scope.submit = function (form) {
    if (form.$invalid) return;
    project.delete().then(function () {
      return ProjectsService.update();
    }).then(function () {
      $uibModalInstance.dismiss('cancel');
    })
  };
});

angular.module('app').directive('projectDelete', function ($uibModal) {
  return {
    restrict: 'EA',
    scope: {
      project: '=projectDelete'
    },
    link: function (scope, el, attrs) {
      el.bind('click', function () {
        $uibModal.open({
          templateUrl: 'templates/modal/project-delete.html',
          controller: 'projectDeleteController',
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
