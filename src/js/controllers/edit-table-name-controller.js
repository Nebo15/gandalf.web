
angular.module('app').controller('EditTableNameController', function ($scope, table, $uibModalInstance) {
  $scope.table = angular.copy(table);

  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };

  $scope.save = function (form) {
    if (form.$invalid) return;

    table.save().then(function () {
      $uibModalInstance.close($scope.table);
    });
  };
});
