'use strict';

angular.module('app').directive('conditionInput', function (CONDITIONS) {

  return {
    restrict: 'E',
    templateUrl: 'templates/directives/condition-input.html',
    scope: {
      type: '=',
      value: '=',
      disabled: '=',
      required: '=',
      number: '='
    },
    link: function (scope) {
      if (scope.number === true) {
        scope.value = Number(scope.value);

        if (isNaN(scope.value)) {
          scope.value = 1;
        }
      }

      scope.conditions = CONDITIONS;
    }
  }
});
