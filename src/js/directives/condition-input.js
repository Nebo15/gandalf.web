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
      scope.conditions = CONDITIONS;
    }
  }
});
