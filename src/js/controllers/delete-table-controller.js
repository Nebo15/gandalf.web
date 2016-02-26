
angular.module('app').controller('DeleteTableController', function ($scope, table, $uibModalInstance) {

  $scope.model = {
    code: null
  };

  $scope.delete = function (form) {
    if (form.$invalid) return;
    $uibModalInstance.close(table);
  };
  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
});
