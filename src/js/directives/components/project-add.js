
'use strict';

angular.module('app').directive('projectAdd', function () {

  return {
    restrict: 'EA',
    transclude: true,
    replace: true,
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
    template: '<a ng-click="openModal()" ng-transclude></a>'
  }
});
