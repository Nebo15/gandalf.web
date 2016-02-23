'use strict';

angular.module('app').filter('json', function () {
  return function (str, spacers) {
    return JSON.stringify(str, null, spacers);
  }
});
