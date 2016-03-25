'use strict';

angular.module('app').directive('booleanSelect', function (CONDITION_TYPES) {
  return {
    restrict: 'E',
    scope: {
      condition: '=',
      value: '='
    },
    templateUrl: 'templates/directives/boolean-select.html' ,
    link: function (scope, el, attrs) {

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

      // convert boolean value to booleanValues item and back

      scope.booleanSelect = scope.booleanValues.filter(function (item) {
        return item.condition == scope.condition && (item.value === scope.value || item.value === null);
      })[0];

      scope.$watch('booleanSelect', function (val) {
        if (!val) return;
        scope.condition = val.condition;
        scope.value = val.value;
      }, true)

    }
  }
});
