angular.module('app').filter('translateArray', function ($filter) {

  return function (source, prefix, sufix) {
    prefix = prefix || '';
    return (source || []).map(function (item) {
      return $filter('translate')(prefix + item + sufix);
    });
  };
});
