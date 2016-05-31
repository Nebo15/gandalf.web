
'use strict';

angular.module('app').directive('projectAdd', function () {

  return {
    restrict: 'EA',
    controller: function ($scope, $uibModal, ProjectsService) {
      $scope.openModal = function () {
        var modalInstance = $uibModal.open({
          templateUrl: 'templates/modal/add-project.html',
          controller: 'ProjectAddController'
        });
        modalInstance.result.then(function (newProject) {
          ProjectsService.selectProject(newProject);
        });
      }
    },
    link: function (scope, el, attrs, ctrls) {
      el.bind('click', function () {
        scope.openModal()
      });
    }
  }
});
