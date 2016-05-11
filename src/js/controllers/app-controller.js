'use strict';

angular.module('app').controller('AppController', function ($scope, ProjectsService, Project, $localStorage, projects, user) {

  $scope.projects = projects;

  var storage = $localStorage.$default({
    project: null
  });

  $scope.project = storage.project ? new Project(storage.project) : projects[0];

  $scope.$watchCollection('project', function (project) {
    storage.project = project;
  });

  $scope.user = user;

  $scope.selectProject = function (project) {
    $scope.project = project;
  };

});
