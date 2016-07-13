'use strict';

angular.module('app').directive('decisionInput', function () {
  return {
    restrict: 'E',
    scope: {
      type: '=',
      decisions: '=',
      readonly: '=',
      model: '=model',
      placeholder: '@'
    },
    templateUrl: 'templates/directives/decision-input.html',
    link: function (scope, el, attrs, ctrl) {
      scope.getDecisions = function (current) {
        var statesCopy = scope.decisions.slice(0);
        if (current) {
          statesCopy.unshift(current);
        }
        return statesCopy;
      };
      scope.onSelect = function ($item) {
        if (scope.decisions.indexOf($item) === -1) {
          scope.decisions.push($item);
        }
      };
    }
  };
});
