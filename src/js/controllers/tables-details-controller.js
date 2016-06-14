
angular.module('app').controller('TablesDetailsController', function ($scope, $state, table, variant) {

  $scope.table = table;
  $scope.variant = variant || table.variants[0];

  if (!variant) {
    $state.go($state.current.name, {
      id: table.id,
      variantId: $scope.variant.id
    }, {
      notify: false,
      reload: false,
      location: 'replace'
    });
  }

});
