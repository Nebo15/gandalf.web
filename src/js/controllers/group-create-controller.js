'use strict';

angular.module('app').controller('GroupCreateController', function ($scope, _, $uibModalInstance, group, DecisionTable) {

  $scope.tables = [];
  $scope.getTables = _.throttle(function (tableName) {
    DecisionTable.find(10, 0, {
      title: tableName,
      matching_type: 'first'
    }).then(function (tables) {
      $scope.tables = tables.data;
    });

    return $scope.tables;
  }, 300);
  $scope.model = group;
  $scope.create = function (form) {
    if (form.$invalid) return;
    $uibModalInstance.close($scope.model);
  };

  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
});
