'use strict';


angular.module('app', [
  'conditions',

  'ng-gandalf',
  'ui.router',
  'ngStorage',
  'ui.bootstrap',
  'ui.sortable'
]);

angular.module('app').controller('MainController', function ($scope, $uibModal, DecisionTable, DecisionField, DecisionRule) {

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
