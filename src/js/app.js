'use strict';


angular.module('app', [
  'conditions',

  'ng-gandalf',
  'ui.router',
  'ngStorage',
  'ui.bootstrap',
  'ui.sortable'
]);

angular.module('app').config(function ($stateProvider, $urlRouterProvider) {

  $stateProvider.state('editor', {
    url: '/',
    controller: 'MainController',
    templateUrl: 'templates/editor.html'
  }).state('history', {
    url: '/history',
    controller: 'HistoryController',
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

angular.module('app').controller('HistoryController', function ($scope, DecisionHistory) {

  $scope.tables = [];
  DecisionHistory.find().then(function (resp) {
    $scope.tables = resp.data;
  });

  $scope.toggleExpandTable = function (table) {
    table.isExpanded = !table.isExpanded;
  };

});

angular.module('app').controller('MainController', function ($scope, $uibModal, DecisionTable, DecisionRule) {

  var table = null;
  DecisionTable.current().then(function (resp) {
    table = resp;
    $scope.table = resp;
  });

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

    })
  }

});
