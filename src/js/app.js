'use strict';


angular.module('app', [
  'ng-gandalf',
  'ui.router',
  'ngStorage',
  'ui.bootstrap',
  'ui.sortable'
]);

angular.module('app').filter('condition', function () {
  var conds = {
    $eq: '=',
    $gt: '>',
    $gte: '>=',
    $lt: '<',
    $lte: '<=',
    $ne: '!=',

    $neq: '!=',
    $in: 'in',
    $nin: 'not in',

    $contains: 'contains'

  };

  return function (cond) {
    return conds[cond];
  };
});

var CONDITION_TYPES = {
  EQUAL: '$eq',
  GREATER_THEN: '$gt',
  GREATER_OR_EQUAL_THEN: '$gte',
  LOWER_THEN: '$lt',
  LOWER_OR_EQUAL_THEN: '$lte',
  NOT_EQUAL: '$ne',
  IN: '$in',
  NOT_IN: '$nin',
  CONTAINS: '$contains'
};

angular.module('app').constant('CONDITION_TYPES', CONDITION_TYPES);
angular.module('app').constant('CONDITIONS', {
  number: [
    CONDITION_TYPES.EQUAL,
    CONDITION_TYPES.GREATER_THEN,
    CONDITION_TYPES.GREATER_OR_EQUAL_THEN,
    CONDITION_TYPES.LOWER_THEN,
    CONDITION_TYPES.LOWER_OR_EQUAL_THEN,
    CONDITION_TYPES.NOT_EQUAL,
    CONDITION_TYPES.IN,
    CONDITION_TYPES.NOT_IN
  ],
  string: [
    CONDITION_TYPES.EQUAL,
    CONDITION_TYPES.NOT_EQUAL,
    CONDITION_TYPES.IN,
    CONDITION_TYPES.NOT_IN,
    CONDITION_TYPES.CONTAINS
  ]
});

angular.module('app').directive('field', function (CONDITIONS) {
  return {
    restrict: 'E',
    scope: {
      type: '=',
      condition: '=',
      value: '='
    },
    templateUrl: 'templates/directives/field.html',
    link: function (scope) {
      scope.conditions = CONDITIONS;
    }
  };

});
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
