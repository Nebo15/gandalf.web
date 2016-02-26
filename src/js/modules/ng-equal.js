'use strict';

function equalDirective () {
  return {
    restrict: 'A',
    require: 'ngModel',
    link: function (scope, el, attrs, ngModel) {

      var equal = attrs.ngEqual || attrs.equal;
      attrs.$observe('equal', function (val) {
        equal = val;
        ngModel.$validate();
      });

      ngModel.$validators.equal = function (val, viewValue) {
        return  ngModel.$isEmpty(viewValue) || val == equal;
      };
    }
  };
}
angular.module('ng-equal', [])
  .directive('equal', equalDirective)
  .directive('ngEqual', equalDirective);
