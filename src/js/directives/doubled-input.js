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

      scope.values = scope.value.split(scope.separator).map(function (item) {return +item;});

      var __valuesChanged = false,
        __valueChanged = false;
      scope.$watchCollection('values', function (res) {
        if (__valueChanged) { return; }

        __valuesChanged = true;
        console.log('change value from values');
        scope.value = res.join(scope.separator);
        $timeout(function () { __valuesChanged = false; });
      });
      scope.$watch('value', function (res) {
        if (__valuesChanged) { return; }

        __valueChanged = true;
        console.log('change values from value');
        scope.values = res.split(scope.separator).map(function (item) {return +item;});
        $timeout(function () { __valueChanged = false; });
      }, true);
    }
  }

});
