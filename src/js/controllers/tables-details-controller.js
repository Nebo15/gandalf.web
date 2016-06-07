
angular.module('app').controller('TablesDetailsController', function ($scope, table) {

  $scope.table = table;
  $scope.variant = table.variants[0];

});
