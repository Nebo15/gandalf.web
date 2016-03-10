'use strict';

angular.module('app').controller('DecisionDetailsController', function ($scope, $state, $uibModal, $timeout, decision,
                                                                        CONDITION_OPTIONS, CONDITION_TYPES, DecisionRule) {

  var table = decision;
  $scope.saved = true;
  $scope.isSaving = false;
  $scope.error = null;

  $scope.table = table;
  $scope.sortableOptions = {
    axis: 'y',
    handle: '> .decision-table__handler'
  };
  $scope.decisions = ['Approve', 'Decline', 'Manual'];

  $scope.getSampleCheck = function (table) {
    var example = {};
    table.fields.forEach(function (item) {
      switch (item.type) {
        case 'number':
          example[item.alias] = 100;
          break;
        case 'string':
          example[item.alias] = 'sample';
          break;
        case 'bool':
          example[item.alias] = true;
          break;
        case 'default':
          example[item.alias] = 'sample';
          break;
      }
    });

    return JSON.stringify(example);
  };

  $scope.revertField = function (field) {
    var modalInstance = $uibModal.open({
      templateUrl: 'templates/modal/revert-field.html',
      controller: 'RevertFieldController',
      resolve: {
        field: field
      }
    });
  };
  $scope.editField = function (field) {
    if (field.isDeleted) return $scope.revertField(field);

    var modalInstance = $uibModal.open({
      templateUrl: 'templates/modal/add-field.html',
      controller: 'AddFieldController',
      resolve: {
        field: function () {
          return field;
        },
        table: function () {
          return table;
        }
      }
    });
    modalInstance.result.then(function (field) {
      if (!field.typeChanged) return;
      table.findConditionsByField(field).forEach(function (item) {
        item.reset();
      });
    })
  };
  $scope.addNewField = function () {

    var modalInstance = $uibModal.open({
      templateUrl: 'templates/modal/add-field.html',
      controller: 'AddFieldController',
      resolve: {
        field: function () {
          return null;
        },
        table: function () {
          return table;
        }
      }
    });
    modalInstance.result.then(function (newField) {
      table.addField(newField);
      table.findConditionsByField(field).forEach(function (item) {
        item.reset();
      });
    });

  };
  $scope.addNewRule = function () {

    var rule = DecisionRule.fromFields(table.fields); // can be different

    rule.conditions.forEach(function (condition) {
      condition.condition = CONDITION_TYPES.IS_SET;
    });
    rule.priority = table.rules.length;
    rule.decision = table.defaultResult;

    table.addRule(rule);

    $scope.editRule(rule);
  };

  $scope.deleteRule = function (rule) {
    rule.isDeleted = true;
  };
  $scope.revertRule = function (rule) {
    rule.isDeleted = false;
  };

  $scope.submit = function (form) {
    if (form.$invalid) return;
    $scope.save();
  };

  $scope.save = function () {
    if ($scope.isSaving) return;
    $scope.isSaving = true;
    table.rules.filter(function (item) {
      return item.isDeleted;
    }).forEach(function (item) {
      table.deleteRule(item);
    });

    table.save().then(function () {
      console.log('save success');
      $scope.error = null;
      $scope.saved = true;
    }, function (err) {
      $scope.error = err;
      console.warn('save error', err);
    }).finally(function () {
      $scope.isSaving = false;
    });
  };

  $scope.deleteTable = function (table) {
    var modalInstance = $uibModal.open({
      templateUrl: 'templates/modal/delete-table.html',
      controller: 'DeleteTableController',
      resolve: {
        table: table
      }
    });
    modalInstance.result.then(function () {
      table.delete().then(function () {
        $state.go('decision-list');
      });
    });
  };

  $scope.editRule = function (rule) {
    console.log('edit rule', rule);
    if (rule.isEditing) return;
    rule.isEditing = true;
  };
  $scope.saveRule = function (rule, form) {
    console.log('save rule', form);
    form.$setSubmitted(true);
    if (form.$invalid) return;
    rule.isEditing = false;
  };
  $scope.copyRule = function (rule, form) {
    console.log('copy rule', form);
    table.copyRule(rule);
  };

  $scope.$watch('table', function () {
    console.log('table change');
    $scope.saved = false;
  }, true);

  var fnOnBeforeUnload = window.onbeforeunload;
  window.onbeforeunload = function () {
    return $scope.saved ? null : 'You have unsaved data';
  };
  $scope.$on('$destroy', function () {
    window.onbeforeunload = fnOnBeforeUnload;
  });

  $timeout(function () {
    $scope.saved = true;
  })

});
