'use strict';

angular.module('app').directive('doubledInput', function ($timeout) {

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

      scope.values = String(scope.value).split(scope.separator).map(function (item) {return +item;});

      var __valuesChanged = false,
        __valueChanged = false;
      scope.$watchCollection('values', function (res) {
        if (__valueChanged) { return; }

        __valuesChanged = true;
        scope.value = res.join(scope.separator);
        $timeout(function () { __valuesChanged = false; });
      });
      scope.$watch('value', function (res) {
        if (__valuesChanged) { return; }

        __valueChanged = true;
        scope.values = res.split(scope.separator).map(function (item) {return +item;});
        $timeout(function () { __valueChanged = false; });
      }, true);
    }
  }

});
