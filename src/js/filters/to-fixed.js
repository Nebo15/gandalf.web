'use strict';

angular.module('app').filter('toFixed', function () {
  return function (val, count) {
    return (+val).toFixed(count || 2);
  };
});
