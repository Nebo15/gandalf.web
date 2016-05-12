'use strict';

angular.module('app').service('ProjectsService', function (Project, $gandalf, $timeout, $rootScope, $localStorage, lodash, utils) {

  var projects = null;

  var storage = $localStorage.$default({
    project: null
  });
  $rootScope.$on('userDidLogout', function () {
    storage.project = null;
  });

  // collection

  this.all = all;
  this.update = update;
  this.selectProject = selectProject;

  this.init = init;

  // functions

  function all() {
    return projects || update();
  }

  function update() {
    return Project.find().then(function (projectsResp) {
      projects = projectsResp;
      $rootScope.$broadcast('projectsDidUpdate', projects);
      return projects;
    });
  }

  function selectProject(project) {
    if (!project) return;
    $gandalf.setProjectId(project.id);
    storage.project = project.toJSON();
    $rootScope.$broadcast('projectDidSelect', project);
    utils.reload();
  }

  function init(projects) {
    console.log('init', projects, storage.project);
    var currentProject = (storage.project ? lodash.find(projects, {
        id: storage.project._id
      }) : null) || projects[0];

    selectProject(currentProject);
  }
});
