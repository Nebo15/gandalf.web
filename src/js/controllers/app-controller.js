'use strict';

angular.module('app').controller('AppController', function ($scope, ProjectsService, Project, $gandalf, $localStorage, projects, user) {

  $scope.projects = projects;
  $scope.user = user;
  $scope.selectProject = selectProject;

  var storage = $localStorage.$default({
    project: null
  });

  selectProject(storage.project ? new Project(storage.project) : projects[0]);

  $scope.$watchCollection('project', function (project) {
    storage.project = project;
  });

  function selectProject (project) {
    $scope.project = project;
    $gandalf.useProject(project);
  }

});
