'use strict';

angular.module('app').service('ProjectsService', function (Project) {

  var projects = null;

  // collection
  this.all = function () {
    return projects || this.update();
  };
  this.update = function () {
    return Project.find().then(function (projectsResp) {
      projects = projectsResp;
      return projects;
    });
  };

});
