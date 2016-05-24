angular.module('app').filter('join', function () {

  return function (source, options) {
    return (source || []).join(options || ',');
  };
});
