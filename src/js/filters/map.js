angular.module('app').filter('map', function () {

  return function (source, options) {
    return (options || {})[source];
  };
});
