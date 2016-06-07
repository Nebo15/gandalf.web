

angular.module('app').directive('decisionTable', function ($uibModal, APP) {

  return {
    restrict: 'E',
    scope: {
      table: '=model',
      variant: '=variant',
      mainForm: '=form'
    },
    transclude: true,
    templateUrl: 'templates/directives/decision-table.html',
    link: function ($scope) {

      var table = $scope.table;
      var variant = $scope.variant;

      $scope.sortableOptions = {
        axis: 'y',
        handle: '> .table-decision-handler'
      };

      $scope.decisions = table.getDecisionVariants();

      $scope.onReorderFields = function (curIdx, nextIdx) {

        $scope.table.variants.forEach(function (item) {
          item.rules.forEach(function (rule) {
            rule.conditions[curIdx] = rule.conditions.splice(nextIdx, 1, rule.conditions[curIdx])[0];
          });
        })
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

      var editingCondition = [];
      // Conditions
      $scope.saveCondition = function (condition) {
        condition.isEditing = false;
      };
      $scope.editCondition = function (condition) {
        editingCondition.forEach($scope.saveCondition);
        editingCondition = [];

        condition.isEditing = true;
        editingCondition.push(condition);
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
        variant.copyRule(rule);
      };

      $scope.deleteRule = function (rule) {
        rule.isDeleted = true;
      };
      $scope.revertRule = function (rule) {
        rule.isDeleted = false;
      };

      $scope.addNewRule = function () {
        $scope.editRule(variant.createRule(table.fields));
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

        var transformFn = function (val) {
          return val
        };
        switch (type) {
          case APP.matchingTypes.first:
            transformFn = function (val) {
              return '' + val;
            };
            break;
          case APP.matchingTypes.all:
            transformFn = function (val) {
              return +val;
            };
            break;
        }

        table.variants.forEach(function (item) {
          item.defaultDecision = transformFn(item.defaultDecision);
          item.rules.forEach(function (item) {
            item.than = transformFn(item.than);

            $scope.editRule(item);
          });
        })

      };

    }
  }
});
