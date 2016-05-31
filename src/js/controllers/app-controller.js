'use strict';

angular.module('app').controller('AppController', function ($scope, $state, ProjectsService, projects, user) {

  $scope.projects = projects;
  $scope.user = user;
  $scope.selectProject = ProjectsService.selectProject;
  $scope.project = ProjectsService.selectedProject();

  $scope.$on('projectDidSelect', function (e, data) {
    $state.go('tables-list');
    $scope.project = data;
  });
  $scope.$on('projectsDidUpdate', function (e, data) {
    $scope.projects = data;
  });

  $scope.$on('$stateChangeError', function (e, toState, toStateParams, fromState, fromStateParams, error) {
    e.preventDefault();
    if (error.status == 404) {
      $state.go('tables-list');
    }
  });
});
