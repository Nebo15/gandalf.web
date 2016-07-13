"use strict";

angular.module('app').directive('decisionRuleDecision', function ($timeout, APP) {
  return {
    restrict: 'A',
    scope: {
      rule: '=',
      decisions: '=',
      matchingType: '=',
      decisionType: '=',
      isEditing: '='
    },
    templateUrl: 'templates/directives/decision-rule-decision.html',
    link: function (scope, el, attrs) {

      scope.matchingTypes = APP.matchingTypes;
      scope.edit = function () {
        scope.isEditing = true;
      };
      scope.save = function () {
        $timeout(function () {
          scope.isEditing = false;
        });
      };

      el.bind('click', function () {
        if (scope.isEditing) return;
        $timeout(function () {
          scope.edit();
        });
      });
    }
  };
})
