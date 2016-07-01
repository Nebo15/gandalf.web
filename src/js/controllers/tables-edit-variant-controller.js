'use strict';

angular.module('app').controller('TablesEditVariantController', function ($scope, $state, $log, $uibModal, $timeout, table) {
  var tableHash = 0;

  $scope.saved = true;
  $scope.isSaving = false;
  $scope.error = null;

  $scope.table = table;

  if ($state.params.newVariant) {
    $scope.variant = table.createVariant($state.params.variantId);
  } else {
    $scope.variant = table.getVariant($state.params.variantId);
  }

  tableHash = $state.params.newVariant ? 0 : $scope.table.getHash();

  $scope.submit = function (form) {
    if (form.$invalid) return;
    if ($scope.isSaving) return;

    $scope.isSaving = true;

    if ($state.params.newVariant && $scope.variant.id === undefined) {
      $scope.table.variants.push($scope.variant);
    }

    table.save().then(function () {
      $scope.error = null;
      $scope.variant.rules.forEach(function (item) {
        item.isEditing = false;
      });

      if ($state.params.newVariant) {
        $state.go('tables-details.variant', {
          variantId: $scope.table.variants[$scope.table.variants.length - 1].id
        });

        return;
      }

      $timeout(function () {
        $scope.saved = true;
      });

      $scope.variant = table.getVariant($scope.variant.id);
      $scope.$broadcast('decisionTable:saved');

      tableHash = $scope.table.getHash();
    }, function (err) {
      $scope.error = err;
    }).finally(function () {
      $scope.isSaving = false;
    });
  };

  $scope.deleteVariant = function () {
    var modalInstance = $uibModal.open({
      templateUrl: 'templates/modal/delete-variant.html',
      controller: 'DeleteTableController',
      resolve: {
        table: table
      }
    });

    modalInstance.result.then(function () {
      table.deleteVariant($scope.variant.id);

      table.save().then(function () {
        $state.go('tables-details.variant', {
          variantId: $scope.table.variants[0].id
        });
      });
    });
  };

  $scope.$watch('table', function (table) {
    $scope.saved = (table.getHash() === tableHash);
  }, true);

  var fnOnBeforeUnload = window.onbeforeunload;
  window.onbeforeunload = function () {
    return $scope.saved ? null : 'You have unsaved data';
  };
  $scope.$on('$destroy', function () {
    window.onbeforeunload = fnOnBeforeUnload;
  });

});
