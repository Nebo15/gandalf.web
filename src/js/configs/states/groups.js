"use strict";

angular.module('app').config(function ($stateProvider) {

  $stateProvider.state('groups-list', {
    parent: 'private',
    url: '/groups?size?page',
    params: {
      size: '25'
    },
    controller: 'GroupsListController',
    templateUrl: 'templates/groups-list.html',
    ncyBreadcrumb: {
      label: 'Groups'
    }
  });

  $stateProvider.state('groups-details', {
    parent: 'private',
    url: '/groups/:id',
    templateUrl: 'templates/groups-details.html',
    controller: 'GroupsDetailsController',
    resolve: {
      group: ['DecisionGroup', '$stateParams', function (DecisionGroup, $stateParams) {
        return (new DecisionGroup($stateParams.id)).fetch();
      }]
    },
    ncyBreadcrumb: {
      label: '{{group.title}}',
      parent: 'groups-list'
    }
  });

});
