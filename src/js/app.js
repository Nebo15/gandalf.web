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
  });

  $urlRouterProvider.otherwise('/');

});

angular.module('app').controller('HistoryController', function ($scope, $uibModal, DecisionTable) {

  $scope.tables = [];
  DecisionTable.find().then(function (resp) {
    console.log(resp);
    $scope.tables = resp.data;
  })

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
