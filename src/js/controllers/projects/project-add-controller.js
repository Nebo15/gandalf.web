'use strict';

angular.module('app').controller('ProjectAddController', function ($scope, Project, ProjectsService, $uibModalInstance) {

  $scope.model = new Project();
  $scope.submit = function (form) {
    if (form.$invalid) {
      return;
    }
    $scope.model.create().then(function (resp) {
      return ProjectsService.update().then(function () {
        $uibModalInstance.close(resp);
      });
    });
  };
  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
});
