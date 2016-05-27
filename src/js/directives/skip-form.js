'use strict';

angular.module('app').directive('skipForm', function ($timeout) {
  return {
    restrict: 'A',
    require: '?form',
    scope: {
      skipForm: '='
    },
    link: function (scope, elm, attrs, ctrl) {

      var parent = elm.parent().controller('form');

      var __isSkipped = false;
      function changeSkip (val){
        if (__isSkipped === val) { return; }

        if (val) {
          parent.$removeControl(ctrl);
        } else {
          parent.$addControl(ctrl);
        }
        parent.$commitViewValue(true);
        __isSkipped = val;
      }
      scope.$watch('skipForm', function (cur, prev) {
        changeSkip(cur);
      })
    }
  };
});
