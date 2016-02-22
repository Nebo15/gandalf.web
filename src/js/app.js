'use strict';


angular.module('app', [
  'conditions',

  'ng-gandalf',
  'ui.router',
  'ngStorage',
  'ui.bootstrap',
  'ui.sortable'
]);

angular.module('app').constant('ENV', window.env);
angular.module('app').config(function ($gandalfProvider, ENV) {
  $gandalfProvider.setEndpoint(ENV.api.endpoint);
  $gandalfProvider.setAuthorization(ENV.api.apiKey, ENV.api.apiSecret);
});

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

angular.module('app').controller('HistoryDetailsController', function ($scope, $stateParams, historyResult) {

  $scope.table = historyResult;

});

angular.module('app').controller('HistoryListController', function ($scope, DecisionHistory) {

  $scope.tables = [];
  DecisionHistory.find().then(function (resp) {
    $scope.tables = resp.data;
  });

  $scope.toggleExpandTable = function (table) {
    table.isExpanded = !table.isExpanded;
  };

});


angular.module('app').controller('DecisionListController', function ($scope, $uibModal, DecisionTable) {

  $scope.tables = null;
  DecisionTable.find().then(function (resp) {
    $scope.tables = resp;
  });

});


angular.module('app').controller('DecisionDetailsController', function ($scope, $uibModal, decision, DecisionRule) {

  var table = decision;
  $scope.table = table;

  $scope.sortableOptions = {
    axis: 'y',
    handle: '> .decision-table__handler'
  };

  $scope.addNewField = function () {

    var modalInstance = $uibModal.open({
      templateUrl: 'templates/modal/add-field.html',
      controller: 'AddFieldController'
    });
    modalInstance.result.then(function (newField) {
      table.addField(newField);
    });

  };
  $scope.addNewRule = function () {

    var rule = DecisionRule.fromFields(table.fields, {
      priority: table.rules.length
    }); // can be different

    table.addRule(rule);
  };

  $scope.save = function () {
    table.save().then(function () {
      console.log('save success')
    }, function () {
      console.warn('save error')
    })
  }

});
