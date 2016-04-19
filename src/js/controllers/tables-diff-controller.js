'use strict';

angular.module('app').controller('TablesDiffController', function ($scope, compare) {

  $scope.table = compare.original;
  $scope.revision = compare.revision;
});
