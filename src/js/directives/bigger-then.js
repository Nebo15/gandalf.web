'use strict';

angular.module('app').directive('biggerThen', function ($timeout) {

  return {
    restrict: 'A',
    require: '?ngModel',
    link: function (scope, elm, attr, ctrl) {
      if (!ctrl) return;

      var minValue = 0;
      attr.$observe('biggerThen', function (value) {
        minValue = +value || 0;
        ctrl.$validate();
      });
      ctrl.$validators.biggerThen = function (modelValue, viewValue) {
        return ctrl.$isEmpty(viewValue) || (viewValue > minValue);
      };
    }
  };
});
