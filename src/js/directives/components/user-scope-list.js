angular.module('app').directive('userScopeList', function () {
  return {
    restrict: 'E',
    scope: {
      model: '=',
      isRequired: '='
    },
    templateUrl: 'templates/directives/user-scope-list.html',
    link: function (scope, el, attrs) {

    }
  };
});
