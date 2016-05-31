angular.module('app').filter('translateArray', function ($filter) {

  return function (source, prefix) {
    prefix = prefix || '';
    return (source || []).map(function (item) {
      return $filter('translate')(prefix + item);
    });
  };
});
