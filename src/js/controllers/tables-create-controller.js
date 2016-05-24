'use strict';

angular.module('app').controller('TablesCreateController', function ($scope, $controller, $state, DecisionTable) {

  $scope.isSaving = false;

  $scope.table = new DecisionTable();

  $scope.submit = function (form) {

    if (form.$invalid) return;

    $scope.isSaving = true;
    $scope.table.create().then(function (resp) {
      $scope.error = null;
      $state.go('tables-details.edit', {id: resp.id});
    }).catch(function (resp) {
      $scope.error = resp;
    }).finally(function () {
      $scope.isSaving = false;
    })
  }

});
