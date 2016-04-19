'use strict';

angular.module('app').controller('TablesDiffController', function ($scope, compare, lodash) {

  $scope.table = compare.original;
  $scope.revision = compare.revision;

  var tables = [$scope.table, $scope.revision];

  function indexes (arrays) {
    var result = [];
    console.log('indexes', arrays);
    arrays.forEach(function (item) {
      result = angular.extend(result, item);
    });
    return result;
  }

  $scope.getFieldIndexes = function () {
    return lodash.union.apply(null, (tables.map(function (item) {
      return Object.keys(item.fieldsObj);
    })));
  }

});
