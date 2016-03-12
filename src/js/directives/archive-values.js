'use strict';

// collect values on blur input
angular.module('app').directive('archiveValues', function ($timeout) {

  return {
    restrict: 'A',
    require: 'ngModel',
    scope: {
      archiveValues: '=archiveValues'
    },
    link: function (scope, el, attrs, ctrl) {
      function addValue (value) {
        if (scope.archiveValues.indexOf(value) !== -1) return;
        scope.archiveValues.push(value);
      }

    }
  }
});
