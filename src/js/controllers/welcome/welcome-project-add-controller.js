
angular.module('app').controller('WelcomeProjectAddController', function ($scope, $state, Project, ProjectsService) {

  $scope.model = new Project();

  $scope.submit = function (form) {
    if (form.$invalid) {
      return;
    }
    $scope.model.create().then(function (resp) {
      return ProjectsService.update().then(function () {
        $state.go('tables-list');
      });
    });
  };

});
