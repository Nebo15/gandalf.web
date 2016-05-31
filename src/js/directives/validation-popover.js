
angular.module('app').directive('validationPopover', function () {
  return {
    restrict: 'EA',
    transclude: true,
    template: '<div class="validation-popover" transclude></div>',
    link: function (scope, el, attrs) {

    }
  };
});
