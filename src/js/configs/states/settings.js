'use strict';

angular.module('app').config(function ($stateProvider) {

  $stateProvider.state('settings', {
    url: '/settings',
    parent: 'private',
    abstract: '.project',
    template: '<ui-view />'
  });

  $stateProvider.state('settings.project', {
    url: '/project/:projectId',
    controller: 'SettingsProjectController',
    templateUrl: 'templates/settings/project.html',
    resolve: {
      // projects is required for waiting
      project: ['ProjectsService','projects', function (ProjectsService) {
        return ProjectsService.current();
      }],
      projectUser: ['UserService', 'projects', function (UserService) {
        return UserService.projectUser();
      }],
      consumers: ['projectUser', 'project', function (user, project) {
        if (~user.scope.indexOf('consumers_get')) {
          return project.fetchConsumers();
        }

        return null;
      }]
    }
  });
});
