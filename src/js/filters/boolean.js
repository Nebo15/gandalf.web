angular.module('app').filter('boolean', function () {

  return function (source, trueStr, falseStr) {

    return source ? trueStr : falseStr;
  };
});
