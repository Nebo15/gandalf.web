"use strict";

angular.module('app').directive('decisionRuleTitleDescription', function ($timeout) {
  return {
    restrict: 'EA',
    templateUrl: 'templates/directives/decision-rule-title-description.html',
    scope: {
      rule: '=model'
    },
    link: function (scope, el, attrs) {

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
        if (scope.isEditing) return;
        $timeout(function () {
          scope.edit();
        });
      });
    }
  };
});
