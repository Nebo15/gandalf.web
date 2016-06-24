"use strict";

angular.module('app').config(function ($stateProvider, $urlRouterProvider) {

  $stateProvider.state('tables', {
    parent: 'private',
    url: '/tables',
    abstract: 'tables-list',
    template: '<ui-view />'
  });

  $stateProvider.state('tables-list', {
    parent: 'tables',
    url: '?size?page',
    params: {
      size: '25'
    },
    controller: 'TablesListController',
    templateUrl: 'templates/tables-list.html'
  }).state('tables-create', {
    parent: 'tables',
    url: '/create',
    controller: 'TablesCreateController',
    templateUrl: 'templates/tables-create.html'
  });

  $stateProvider.state('tables-details', {
    parent: 'tables',
    abstract: '.edit',
    url: '/:id',
    template: '<ui-view />',
    resolve: {
      table: ['DecisionTable', '$stateParams', 'projects', function (DecisionTable, $stateParams, projects) {
        return DecisionTable.byId($stateParams.id);
      }]
    },
    ncyBreadcrumb: {
      label: "{{table.title || 'Untitled table'}}",
      parent: 'tables-list',
      skip: false
    }
  }).state('tables-details.edit', {
    url: '/edit',
    controller: 'TablesEditController',
    templateUrl: 'templates/tables-edit.html'
  }).state('tables-details.variant', {
    abstract: 'tables-details.variant.edit',
    url: '/:variantId',
    controller: 'TablesDetailsController',
    templateUrl: 'templates/tables-details.html',
    resolve: {
      variant: ['table', '$stateParams', function (table, $stateParams) {
        return table.getVariant($stateParams.variantId);
      }]
    }

  }).state('tables-details.variant.edit', {
    url: '/edit',
    controller: 'TablesEditVariantController',
    templateUrl: 'templates/tables-edit-variant.html'
  }).state('tables-details.variant.analytics', {
    url: '/analytics',
    controller: 'TablesAnalyticsController',
    templateUrl: 'templates/tables-analytics.html',
    resolve: {
      analytics: ['AnalyticsTable', '$stateParams', function (AnalyticsTable, $stateParams) {
        return AnalyticsTable.byIdAndVariantId($stateParams.id, $stateParams.variantId);
      }]
    }
  }).state('tables-details.variant.revisions', {
    url: '/revisions',
    controller: 'TablesRevisionsController',
    templateUrl: 'templates/tables-revisions.html'
  }).state('tables-details.variant.debugger', {
    url: '/debug',
    controller: 'DebuggerDetailsController',
    templateUrl: 'templates/tables-debugger.html',
    params: {
      id: null,
      decision: null
    }
  }).state('tables-details.variant.new', {
    url: '/new',
    controller: 'TablesEditVariantController',
    templateUrl: 'templates/tables-edit-variant.html',
    params: {
      newVariant: true
    }
  });

  $stateProvider.state('tables-diff', {
    parent: 'tables',
    url: '/:id/diff/:revisionId',
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
    }
  });

});
