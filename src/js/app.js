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
  'ui.gravatar',

  'toastr'
]);

var config = {};
try {
  config = JSON.parse(unescape(window.__CONFIG__));
} catch (e) {
  console.warn('Error while parsing env config', e);
}

angular.module('app').constant('ENV', {
  "debug": config.DEBUG === 'true',
  "api": {
    "endpoint": config.API_ENDPOINT,
    "proxyPath": config.API_PROXY_PATH,
    "clientId": config.API_CLIENTID,
    "clientSecret": config.API_CLIENTSECRET
  },
  "providers": {
    "bugsnag": {
      "apiKey": config.PROVIDERS_BUGSNAG_APIKEY,
      "stage": config.PROVIDERS_BUGSNAG_STAGE,
    },
  },
});

angular.module('app').constant('APP', {
  types: {
    number: 'numeric',
    string: 'string',
    bool  : 'boolean'
  },
  matchingTypes: {
    first : 'decision', // decision table
    all   : 'scoring'    // scoring
  },
  decisionTypes: {
    alphaNumeric: 'alpha_num',
    string: 'string',
    json: 'json',
    numeric: 'numeric'
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
