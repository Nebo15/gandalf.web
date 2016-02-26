angular.module('app').directive('stopPropagation', function () {
  return {
    restrict: 'A',
    link: function (scope, el, attrs) {

      el.bind(attrs.stopPropagation, function (e) {
        e.stopPropagation();
      })
    }
  }
});
