'use strict';

angular.module('app').controller('GroupCreateController', function ($scope, $uibModalInstance, group, DecisionTable) {

  $scope.tables = [];
  $scope.getTables = function (tableName) {
    DecisionTable.find(10, 0, {
      title: tableName,
      matching_type: 'first'
    }).then(function (tables) {
      $scope.tables = tables.data;
    });

    return $scope.tables;
  };
  $scope.model = group;
  $scope.create = function (form) {
    if (form.$invalid) return;
    $uibModalInstance.close($scope.model);
  };

  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
});
