'use strict';

angular.module('app').directive('field', function ($timeout, CONDITIONS, CONDITION_TYPES, CONDITION_OPTIONS) {
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

      scope.hasInput = function (condition) {
        return CONDITION_OPTIONS.hasNotValue.indexOf(condition) === -1;
      };

      scope.booleanValues = [{
        value: true,
        condition: CONDITION_TYPES.EQUAL,
        name: 'true'
      }, {
        value: false,
        condition: CONDITION_TYPES.EQUAL,
        name: 'false'
      }, {
        condition: CONDITION_TYPES.IS_SET,
        value: null,
        name: 'is set'
      }];

      if (scope.type == 'bool') {
        scope.booleanSelect = scope.booleanValues.filter(function (item) {
          return item.condition == scope.condition && item.value === scope.value;
        })[0];

        scope.$watch('booleanSelect', function (val) {
          if (!val) return;
          console.log('booleanSelect', val);
          scope.condition = val.condition;
          scope.value = val.value;
        }, true)
      }
    }
  };

});
