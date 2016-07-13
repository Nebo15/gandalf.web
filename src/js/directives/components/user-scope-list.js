angular.module('app').directive('userScopeList', function () {
  return {
    restrict: 'E',
    scope: {
      model: '=',
      project: '=',
      isRequired: '='
    },
    templateUrl: 'templates/directives/user-scope-list.html',
    link: function (scope, el, attrs) {

    }
  };
});
