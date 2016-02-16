'use strict';

angular.module('app').directive('field', function (CONDITIONS) {
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
    }
  };

});
