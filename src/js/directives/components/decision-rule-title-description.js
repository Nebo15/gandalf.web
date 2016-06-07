"use strict";

angular.module('app').directive('decisionRuleTitleDescription', function () {
  return {
    restrict: 'EA',
    templateUrl: 'templates/directives/decision-rule-title-description.html',
    link: function (scope, el, attrs) {

      scope.isEditing = false;
      scope.edit = function () {
        console.log('edit');
        scope.isEditing = true;
      };
      scope.save = function () {
        scope.isEditing = false;
      };
    }
  };
});
