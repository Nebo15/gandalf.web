"use strict";

angular.module('app').config(function ($stateProvider, $urlRouterProvider) {

  $stateProvider.state('tables', {
    parent: 'private',
    url: '/tables',
    abstract: 'tables-list',
    template: '<ui-view />',
    ncyBreadcrumb: {
      skip: true
    }
  });

  $stateProvider.state('tables-list', {
    parent: 'tables',
    url: '?size?page',
    params: {
      size: '25'
    },
    controller: 'TablesListController',
    templateUrl: 'templates/tables-list.html',
    ncyBreadcrumb: {
      label: 'Tables'
    }
  }).state('tables-create', {
    parent: 'tables',
    url: '/create',
    controller: 'TablesCreateController',
    templateUrl: 'templates/tables-create.html',
    ncyBreadcrumb: {
      label: 'Create new table',
      parent: 'tables-list'
    }
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
    templateUrl: 'templates/tables-details-edit.html',
    ncyBreadcrumb: {
      label: 'Table detail'
    }
  }).state('tables-details.variant', {
    abstract: 'tables-details.variant.edit',
    url: '/:variantId',
    controller: 'TablesDetailsController',
    templateUrl: 'templates/tables-details-variant.html',
    resolve: {
      variant: ['table', '$stateParams', function (table, $stateParams) {
        return table.getVariant($stateParams.variantId);
      }]
    },
    ncyBreadcrumb: {
      label: "{{variant.title || 'Untitled variant'}}"
    }

  }).state('tables-details.variant.edit', {
    url: '/edit',
    controller: 'TablesEditVariantController',
    templateUrl: 'templates/tables-details-variant-edit.html',
    ncyBreadcrumb: {
      label: 'Edit'
    }
  }).state('tables-details.variant.analytics', {
    url: '/analytics',
    controller: 'TablesAnalyticsController',
    templateUrl: 'templates/tables-details-variant-analytics.html',
    resolve: {
      analytics: ['AnalyticsTable', '$stateParams', function (AnalyticsTable, $stateParams) {
        return AnalyticsTable.byIdAndVariantId($stateParams.id, $stateParams.variantId);
      }]
    },
    ncyBreadcrumb: {
      label: 'Analytics'
    }
  }).state('tables-details.variant.revisions', {
    url: '/revisions',
    controller: 'TablesRevisionsController',
    templateUrl: 'templates/tables-details-variant-revisions.html',
    ncyBreadcrumb: {
      label: 'Revisions'
    }
  }).state('tables-details.variant.debugger', {
    url: '/debug',
    controller: 'DebuggerDetailsController',
    templateUrl: 'templates/tables-details-variant-debugger.html',
    ncyBreadcrumb: {
      label: 'Debugger'
    },
    params: {
      id: null,
      decision: null
    }
  }).state('tables-details.variant.new', {
    url: '/new',
    controller: 'TablesEditVariantController',
    templateUrl: 'templates/tables-details-variant-edit.html',
    ncyBreadcrumb: {
      label: 'New variant'
    },
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
    },
    ncyBreadcrumb: {
      label: 'Diff: {{revision.id}}',
      parent: 'tables-details.edit'
    }
  });

});
