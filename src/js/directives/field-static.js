'use strict';

angular.module('app').directive('fieldStatic', function (CONDITION_OPTIONS) {
  return {
    restrict: 'E',
    scope: {
      condition: '=',
      value: '='
    },
    templateUrl: 'templates/directives/field-static.html',
    link: function (scope) {
      scope.hasValue = function (condition) {
        return CONDITION_OPTIONS.hasNotValue.indexOf(condition) === -1;
      };
    }
  };

});
