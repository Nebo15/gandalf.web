'use strict';


angular.module('app', [
  'conditions',
  'ng-equal',
  'lodash',

  'ng-gandalf',
  'ui.router',
  'ct.ui.router.extras',
  'ui.router.default',

  'ngStorage',
  'ngMessages',
  'ngSanitize',

  'ui.bootstrap',
  'ui.sortable',
  'uibModalConfirm',

  'hljs',
  'angular-bugsnag',
  'dragcolumns',
  'table-fixed-rows',

  'angular-loading-bar',
  'checklist-model',

  'nebo-angular-validate',

  'pascalprecht.translate',
  'ui.gravatar'
]);

angular.module('app').constant('ENV', window.env);
angular.module('app').constant('APP', {
  types: {
    number: 'numeric',
    string: 'string',
    bool  : 'boolean'
  },
  matchingTypes: {
    first : 'decision', // decision table
    all   : 'scoring'    // scoring
  }
}).run(function ($rootScope, $state, APP) {
  $rootScope.APP = APP;
});

angular.module('app').filter('string', function () {
  return function (str) {
    return str == null ? 'null' : str.toString();
  };
});

angular.module('app').config(function (hljsServiceProvider) {
  hljsServiceProvider.setOptions({
    // replace tab with 4 spaces
    tabReplace: '  '
  });
});


