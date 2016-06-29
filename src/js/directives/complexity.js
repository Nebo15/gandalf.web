'use strict';

angular.module('app').directive('complexity', function () {
  return {
    template: '<div class="complexity {{class}}">' +
      '<div class="complexity-list"><span ng-repeat="i in [1,2,3,4]" ng-class="{\'is-active\': $index <= score}"></span></div>' +
    '</div>',
    restrict: 'A',
    scope: {
      complexity: '=',
      complexityPassword: '='
    },
    link: function (scope) {

      var config = [
        {
          class: '',
        },
        {
          class: 'is-week',
        },
        {
          class: 'is-fair',
        },
        {
          class: 'is-good'
        },
        {
          class: 'is-strong'
        }
      ];

      scope.score = 0;
      scope.class = '';

      scope.$watch ('complexityPassword', function (val) {
        console.log('password', val);
        var result = zxcvbn(val || '');
        scope.score = result.score;
        scope.class = config[scope.score].class;

        scope.complexity = result;
      });
    }
  };
});
