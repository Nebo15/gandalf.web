'use strict';

angular.module('app').controller('RevertFieldController', function ($scope, $uibModalInstance, field) {

  $scope.field = field;
  $scope.revert = function () {
    field.isDeleted = false;
    $uibModalInstance.close(field);
  };

  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
});
