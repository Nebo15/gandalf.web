
angular.module('app').controller('TablesDetailsController', function ($scope, $state, table) {

  $scope.table = table;
  if ($scope.table.variants.length == 1) {
    $scope.variant = $scope.table.variants[0];
  }
});
