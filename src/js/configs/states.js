angular.module('app').config(function ($stateProvider, $urlRouterProvider) {

  $stateProvider.state('decision-list', {
    url: '/?size?page',
    controller: 'DecisionListController',
    templateUrl: 'templates/decision-list.html',
    ncyBreadcrumb: {
      label: 'Tables'
    }
  }).state('decision-create', {
    url: '/decision/create',
    controller: 'DecisionCreateController',
    templateUrl: 'templates/decision-details.html',
    ncyBreadcrumb: {
      label: 'Create new table',
      parent: 'decision-list'
    }
  }).state('decision-details', {
    url: '/decision/:id',
    controller: 'DecisionDetailsController',
    templateUrl: 'templates/decision-details.html',
    resolve: {
      decision: ['DecisionTable', '$stateParams', function (DecisionTable, $stateParams) {
        return DecisionTable.byId($stateParams.id);
      }]
    },
    ncyBreadcrumb: {
      label: 'Edit: {{table.title}}',
      parent: 'decision-list'
    }
  });

  $stateProvider.state('history-list', {
    url: '/history?tableId?size?page',
    controller: 'HistoryListController',
    templateUrl: 'templates/history.html',
    ncyBreadcrumb: {
      label: 'History'
    }
  }).state('history-details', {
    url: '/history/:id',
    controller: 'HistoryDetailsController',
    templateUrl: 'templates/history-details.html',
    ncyBreadcrumb: {
      label: 'Decision: {{table.id}}',
      parent: 'history-list'
    },
    resolve: {
      historyResult: function (DecisionHistory, $stateParams) {
        var res = new DecisionHistory($stateParams.id);
        return res.fetch();
      }
    }
  });

  $urlRouterProvider.otherwise('/');
});
