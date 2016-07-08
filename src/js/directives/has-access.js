angular.module('app').directive('hasAccess', function () {
  var NO_ACCESS_CLASS = 'no-access-control';

  return {
    restrict: 'A',
    scope: {
      hasAccess: '@hasAccess',
      project: '='
    },
    link: function (scope, el) {
      if (!scope.project.hasUserAccess.apply(scope.project, scope.hasAccess.split('.'))) {
        if (el.is('input')) {
          el.attr('readonly', 'readonly');
        } else {
          el.addClass(NO_ACCESS_CLASS);
        }
      }
    }
  }
});
