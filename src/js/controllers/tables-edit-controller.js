'use strict';

angular.module('app').controller('TablesEditController', function ($scope, $state, $log, $uibModal, $timeout, table) {
  var tableHash = 0;

  $scope.saved = true;
  $scope.isSaving = false;
  $scope.error = null;

  $scope.table = table;
  $scope.variant = $scope.variant || null;

  tableHash = table.getHash();

  $scope.submit = function (form) {

    if (form.$invalid) return;
    if ($scope.isSaving) return;

    $scope.isSaving = true;

    table.save().then(function () {
      $scope.error = null;
      $scope.variant.rules.forEach(function (item) {
        item.isEditing = false;
      });

      $timeout(function () {
        $scope.saved = true;
      });

      $scope.variant = table.getVariant($scope.variant.id);

      tableHash = table.getHash();
    }, function (err) {
      $scope.error = err;
    }).finally(function () {
      $scope.isSaving = false;
    });
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

  $scope.$watch('table', function (val) {
    $scope.saved = (val.getHash() === tableHash);
  }, true);

  var fnOnBeforeUnload = window.onbeforeunload;
  window.onbeforeunload = function () {
    return $scope.saved ? null : 'You have unsaved data';
  };
  $scope.$on('$destroy', function () {
    window.onbeforeunload = fnOnBeforeUnload;
  });

  $timeout(function () {
    $scope.saved = true;
  })

});
