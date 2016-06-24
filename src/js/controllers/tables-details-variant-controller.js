
angular.module('app').controller('TablesDetailsVariantController', function ($scope, $state, table, variant) {

  $scope.table = table;
  $scope.variant = variant || table.variants[0];

  $scope.selectVariant = function (variant) {
    $scope.variant = variant;
    $state.go($state.current.name, {
      id: table.id,
      variantId: $scope.variant.id
    }, {
      notify: true,
      reload: true,
      location: 'replace'
    });
  };
});
