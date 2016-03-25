'use strict';

angular.module('app').directive('field', function ($timeout, APP, CONDITIONS, CONDITION_OPTIONS) {
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

    }
  };

});
