angular.module('app').config(function ($stateProvider, $urlRouterProvider) {

  $stateProvider.state('main', {

    abstract: true,
    template: '<ui-view />'
  });

  $stateProvider.state('private', {
    parent: 'auth',
    abstract: true,
    auth: true,
    template: '<ui-view />'
  });
  $stateProvider.state('public', {
    parent: 'auth',
    abstract: true,
    auth: false,
    template: '<ui-view />'
  });

  $stateProvider.state('sign-in', {
    url: '/sign-in?username',
    controller: 'SignInController',
    templateUrl: 'templates/sign-in.html',
    ncyBreadcrumb: {
      label: 'Sign in to Gandalf'
    }
  }).state('sign-up', {
    url: '/sign-up?username?email',
    controller: 'SignUpController',
    templateUrl: 'templates/sign-up.html',
    ncyBreadcrumb: {
      label: 'Sign up to Gandalf'
    }
  });

  $stateProvider.state('tables-list', {
    parent: 'private',
    url: '/?size?page',
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
    templateUrl: 'templates/tables-details.html',
    ncyBreadcrumb: {
      label: 'Create new table',
      parent: 'tables-list'
    }
  }).state('tables-details', {
    parent: 'private',
    url: '/tables/:id',
    controller: 'TablesDetailsController',
    templateUrl: 'templates/tables-details.html',
    resolve: {
      decision: ['DecisionTable', '$stateParams', function (DecisionTable, $stateParams) {
        return DecisionTable.byId($stateParams.id);
      }]
    },
    ncyBreadcrumb: {
      label: 'Edit: {{table.title}}',
      parent: 'tables-list'
    }
  }).state('tables-analytics', {
    parent: 'private',
    url: '/tables/:id/analytics',
    controller: 'TablesAnalyticsController',
    templateUrl: 'templates/tables-analytics.html',
    resolve: {
      analytics: ['AnalyticsTable', '$stateParams', function (AnalyticsTable, $stateParams) {
        return AnalyticsTable.byId($stateParams.id);
      }]
    },
    ncyBreadcrumb: {
      label: 'Analytics',
      parent: 'tables-details'
    }
  }).state('tables-diff', {
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
      parent: 'tables-details'
    }
  });

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

  $stateProvider.state('history-list', {
    parent: 'private',
    url: '/history?tableId?size?page',
    params: {
      size: '25'
    },
    controller: 'HistoryListController',
    templateUrl: 'templates/history-list.html',
    ncyBreadcrumb: {
      label: 'History'
    },
    resolve: {
      selectedTable: ['DecisionTable','$stateParams', function (DecisionTable, $stateParams) {
        return $stateParams.tableId ? DecisionTable.byId($stateParams.tableId) : null;
      }]
    }
  }).state('history-details', {
    parent: 'private',
    url: '/history/:id',
    controller: 'HistoryDetailsController',
    templateUrl: 'templates/history-details.html',
    ncyBreadcrumb: {
      label: 'Decision: {{table.id}}',
      parent: 'history-list'
    },
    resolve: {
      historyResult: ['DecisionHistoryTable', '$stateParams', function (DecisionHistoryTable, $stateParams) {
        var res = new DecisionHistoryTable($stateParams.id);
        return res.fetch();
      }]
    }
  });

  $stateProvider.state('debugger-details', {
    parent: 'private',
    url: '/tables/:id/debug',
    controller: 'DebuggerDetailsController',
    templateUrl: 'templates/debugger-details.html',
    ncyBreadcrumb: {
      label: 'Debugger: {{table.id}}',
      parent: 'tables-details'
    },
    params: {
      id: null,
      decision: null
    },
    resolve: {
      table: ['DecisionTable', '$stateParams', function (DecisionTable, $stateParams) {
        return DecisionTable.byId($stateParams.id);
      }]
    }
  });

  $urlRouterProvider.otherwise('/');
});
