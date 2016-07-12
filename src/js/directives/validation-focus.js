angular.module('app').directive('validationFocus', function () {
  return {
    restrict: 'A',
    link: function (scope, elem) {
      elem.on('submit', function () {
        elem.find('.ng-invalid').focus();
      });
    }
  }
});
