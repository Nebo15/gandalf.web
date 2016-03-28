'use strict';

angular.module('app').directive('doubledInput', function () {

  return {
    restrict: 'E',
    templateUrl: 'templates/directives/doubled-input.html',
    scope: {
      separator: '@',
      value: '=',
      disabled: '=',
      required: '='
    },
    link: function (scope) {
      scope.separator = scope.separator || ';';

      scope.values = [];
      scope.$watchCollection('values', function (res) {
        scope.value = res.join(scope.separator);
      });
      scope.$watch('value', function (res) {
        scope.values = res.split(scope.separator);
      })
    }
  }

});
