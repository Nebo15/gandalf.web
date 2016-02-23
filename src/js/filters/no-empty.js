'use strict';

angular.module('app').filter('noEmpty', function () {
  return function (val) {
    return val || ' '
  };
});
