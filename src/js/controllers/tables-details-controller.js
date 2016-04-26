'use strict';

angular.module('app').controller('TablesDetailsController', function ($scope, $state, $log, $uibModal, $timeout, decision, CONDITION_TYPES) {

  var table = decision;
  $scope.saved = true;
  $scope.isSaving = false;
  $scope.error = null;

  $scope.table = table;
  $scope.sortableOptions = {
    axis: 'y',
    handle: '> .decision-table__handler'
  };

  $scope.decisions = table.getDecisionVariants();

  table.getChangelogs().then(function (resp) {
    $scope.changelogs = resp;
  });

  $scope.onReorderFields = function (curIdx, nextIdx) {

    $scope.table.rules.forEach(function (rule) {
      rule.conditions[curIdx] = rule.conditions.splice(nextIdx, 1, rule.conditions[curIdx])[0];
    });
  };
  // Fields

  $scope.revertField = function (field) {
    $uibModal.open({
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

  // Rules

  $scope.validateRule = function (rule, form) {
    $scope.editRule(rule);
    $scope.saveRule(rule, form);
  };

  $scope.editRule = function (rule) {
    rule.isEditing = true;
  };
  $scope.saveRule = function (rule, form) {
    form.$setSubmitted(true);
    if (form.$invalid) return;
    rule.isEditing = false;
  };
  $scope.copyRule = function (rule, form) {
    table.copyRule(rule);
  };

  $scope.deleteRule = function (rule) {
    rule.isDeleted = true;
  };
  $scope.revertRule = function (rule) {
    rule.isDeleted = false;
  };

  $scope.addNewRule = function () {
    $scope.editRule(table.createRule());
  };

  $scope.isWarningRule = function (rule) {
    var res = true;
    for (var i in rule.conditions) {
      if (rule.conditions[i].condition !== CONDITION_TYPES.IS_SET) {
        res = false;
        break;
      }
    }
    return res;
  };


  // Table

  $scope.onChangeMatchingType = function (type) {
    $log.debug('change type', type);
    var transformFn = function (val) {
      return val
    };
    switch (type) {
      case $scope.APP.matchingTypes.first:
        transformFn = function (val) {
          return '' + val;
        };
        break;
      case $scope.APP.matchingTypes.all:
        transformFn = function (val) {
          return parseInt(val, 10);
        };
        break;
    }

    table.defaultDecision = transformFn(table.defaultDecision);
    table.rules.forEach(function (item) {
      item.than = transformFn(item.than);

      $scope.editRule(item);
    });
  };

  $scope.rollbackChangelog = function (changelog) {
    //return $state.go('tables-diff', {
    //  id: table.id,
    //  revisionId: changelog.id
    //});
    return changelog.rollback().then(function () {
      return table.fetch()
    });
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

      table.rules.forEach(function (item) {
        item.isEditing = false;
      });

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
        $state.go('tables-list');
      });
    });
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
