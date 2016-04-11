'use strict';

angular.module('app').filter('last', function () {
  return function (arr, val) {
    return [].join.call([].slice.call(arr, Math.max(arr.length - val, 1)), '')
  }
});
