"use strict";

angular.module('app').directive('decisionRuleDecision', function ($timeout, APP) {
  return {
    restrict: 'A',
    scope: {
      rule: '=',
      decisions: '=',
      type: '='
    },
    templateUrl: 'templates/directives/decision-rule-decision.html',
    link: function (scope, el, attrs) {

      scope.matchingTypes = APP.matchingTypes;
      scope.$on('decisionTable:saved', function () {
        scope.save();
      });

      scope.isEditing = false;
      scope.edit = function () {
        scope.isEditing = true;
      };
      scope.save = function () {
        $timeout(function () {
          scope.isEditing = false;
        });
      };

      el.bind('click', function () {
        console.log('click', scope);
        if (scope.isEditing) return;
        $timeout(function () {
          scope.edit();
        });
      });

    }
  };
})
