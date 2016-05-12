'use strict';

angular.module('app').controller('AppController', function ($scope, ProjectsService, projects, user) {

  console.log('app controller', user, projects);
  $scope.projects = projects;
  $scope.user = user;
  $scope.selectProject = ProjectsService.selectProject;
  $scope.project = ProjectsService.selectedProject();

  $scope.$on('projectDidSelect', function (e, data) {
    $scope.project = data;
  });
  $scope.$on('projectsDidUpdate', function (e, data) {
    $scope.projects = data;
  });

  //ProjectsService.init(projects);

});
