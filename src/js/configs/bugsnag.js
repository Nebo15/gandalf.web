'use strict';


angular.module('app').config(function (bugsnagProvider, ENV) {
  bugsnagProvider
    .noConflict()
    .apiKey(ENV.providers.bugsnag.apiKey)
    .releaseStage(ENV.providers.bugsnag.stage)
    //.appVersion(APP.version)
    .beforeNotify(['$log', function ($log) {
      return function (error, metaData) {
        $log.debug(error.name);
        return true;
      };
    }]);
});
