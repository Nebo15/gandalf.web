angular.module('app').config(function ($stateProvider, $urlRouterProvider) {

  $stateProvider.state('decision-list', {
    url: '/',
    controller: 'DecisionListController',
    templateUrl: 'templates/decision-list.html'
  }).state('decision-details', {
    url: '/decision/:id',
    controller: 'DecisionDetailsController',
    templateUrl: 'templates/decision-details.html',
    resolve: {
      decision: ['DecisionTable', '$stateParams', function (DecisionTable, $stateParams) {
        return DecisionTable.byId($stateParams.id);
      }]
    }
  }).state('history', {
    url: '/history',
    controller: 'HistoryListController',
    templateUrl: 'templates/history.html'
  }).state('history-details', {
    url: '/history/:id',
    controller: 'HistoryDetailsController',
    templateUrl: 'templates/history-details.html',
    resolve: {
      historyResult: function (DecisionHistory, $stateParams) {
        var res = new DecisionHistory($stateParams.id);
        return res.fetch();
      }
    }
  });

  $urlRouterProvider.otherwise('/');

});

