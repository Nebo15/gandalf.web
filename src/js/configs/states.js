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
