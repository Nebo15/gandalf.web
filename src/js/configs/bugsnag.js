'use strict';

angular.module('app').config(function (bugsnagProvider, ENV) {
  bugsnagProvider
    .noConflict()
    .apiKey(ENV.providers.bugsnag.apiKey)
    .releaseStage(ENV.providers.bugsnag.stage)
    .appVersion('0.1.0') //TODO: replace with value from package.json
    .autoNotify(true);
});
