"use strict";

angular.module('app').config(function ($stateProvider) {

  $stateProvider.state('tables-list', {
    parent: 'private',
    url: '/tables?size?page',
    params: {
      size: '25'
    },
    controller: 'TablesListController',
    templateUrl: 'templates/tables-list.html',
    ncyBreadcrumb: {
      label: 'Tables'
    }
  }).state('tables-create', {
    parent: 'private',
    url: '/tables/create',
    controller: 'TablesCreateController',
    templateUrl: 'templates/tables-create.html',
    ncyBreadcrumb: {
      label: 'Create new table',
      parent: 'tables-list'
    }
  });

  $stateProvider.state('tables-details', {
    parent: 'private',
    abstract: true,
    url: '/tables/:id',
    templateUrl: 'templates/tables-details.html',
    controller: 'TablesDetailsController',
    resolve: {
      table: ['DecisionTable', '$stateParams', 'projects', function (DecisionTable, $stateParams, projects) {
        return DecisionTable.byId($stateParams.id);
      }]
    },
    ncyBreadcrumb: {
      label: "{{$parent.table.title}}",
      parent: 'tables-list',
      skip: false
    }
  }).state('tables-details.edit', {
    url: '/edit',
    controller: 'TablesEditController',
    templateUrl: 'templates/tables-edit.html',
    ncyBreadcrumb: {
      label: 'Edit'
    }
  }).state('tables-details.analytics', {
    url: '/analytics',
    controller: 'TablesAnalyticsController',
    templateUrl: 'templates/tables-analytics.html',
    resolve: {
      analytics: ['AnalyticsTable', '$stateParams', function (AnalyticsTable, $stateParams) {
        return AnalyticsTable.byId($stateParams.id);
      }]
    },
    ncyBreadcrumb: {
      label: 'Analytics'
    }
  }).state('tables-details.revisions', {
    url: '/revisions',
    controller: 'TablesRevisionsController',
    templateUrl: 'templates/tables-revisions.html',
    ncyBreadcrumb: {
      label: 'Revisions'
    }
  }).state('tables-details.debugger', {
    url: '/debug',
    controller: 'DebuggerDetailsController',
    templateUrl: 'templates/tables-debugger.html',
    ncyBreadcrumb: {
      label: 'Debugger'
    },
    params: {
      id: null,
      decision: null
    }
  });

  $stateProvider.state('tables-diff', {
    parent: 'private',
    url: '/tables/:id/diff/:revisionId',
    controller: 'TablesDiffController',
    templateUrl: 'templates/tables-diff.html',
    resolve: {
      compare: ['$gandalf', '$stateParams', 'DecisionDiffTable', function ($gandalf, $stateParams, DecisionDiffTable) {
        return $gandalf.admin.getTableChangelogsDiff($stateParams.id, $stateParams.revisionId).then(function (resp) {
          return {
            original: new DecisionDiffTable(null, resp.data.original.model.attributes),
            revision: new DecisionDiffTable(null, resp.data.compare_with.model.attributes)
          }
        })
      }]
    },
    ncyBreadcrumb: {
      label: 'Diff: {{revision.id}}',
      parent: 'tables-details.edit'
    }
  });

});
