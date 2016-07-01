
angular.module('app').controller('TablesDetailsController', function ($scope, $uibModal, $state, table, variant) {

  $scope.table = table;
  $scope.variant = variant;

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

  $scope.createNewVariant = function () {
    var newVariant = $scope.table.createVariant(variant.id);
    newVariant.title = $scope.table.title + ' ' + ($scope.table.variants.length+1);

    $scope.table.variants.push(newVariant);
    $scope.table.save().then(function (table) {
      return $state.go('tables-details.edit', {
        table: table.id,
        variantId: table.variants[table.variants.length - 1].id
      })
    })
  };

  $scope.deleteTable = function (table) {
    var modalInstance = $uibModal.open({
      templateUrl: 'templates/modal/delete-table.html',
      controller: 'DeleteTableController',
      resolve: {
        table: table
      }
    });

    modalInstance.result.then(function () {
      table.delete().then(function () {
        $state.go('tables-list');
      });
    });
  };

  if (!$scope.variant) $scope.selectVariant($scope.table.variants[0]);


});
