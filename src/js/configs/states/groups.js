"use strict";

angular.module('app').config(function ($stateProvider) {

  $stateProvider.state('groups', {
    parent: 'private',
    url: '/groups',
    abstract: 'groups-list',
    template: '<ui-view />'
  });

  $stateProvider.state('groups-list', {
    parent: 'groups',
    url: '?size?page',
    params: {
      size: '25'
    },
    controller: 'GroupsListController',
    templateUrl: 'templates/groups-list.html'
  });

  $stateProvider.state('groups-details', {
    parent: 'groups',
    url: '/:id',
    templateUrl: 'templates/groups-details.html',
    controller: 'GroupsDetailsController',
    resolve: {
      group: ['DecisionGroup', '$stateParams', 'projects', function (DecisionGroup, $stateParams, projects) {
        return (new DecisionGroup($stateParams.id)).fetch();
      }]
    }
  });

});
