'use strict';

angular.module('app').config(function ($stateProvider) {

  $stateProvider.state('settings', {
    url: '/settings',
    parent: 'private',
    abstract: '.project',
    template: '<ui-view />',
    ncyBreadcrumb: {
      skip: true
    }
  });

  $stateProvider.state('settings.project', {
    url: '/project/:projectId',
    controller: 'SettingsProjectController',
    templateUrl: 'templates/settings/project.html',
    resolve: {
      // projects is required for waiting
      project: ['ProjectsService','projects', 'user', function (ProjectsService) {
        return ProjectsService.current();
      }],
      consumers: ['user', 'project', function (user, project) {
        if (~user.scope.indexOf('get_consumers')) {
          return project.fetchConsumers();
        }

        return null;
      }]
    }
  });
});
