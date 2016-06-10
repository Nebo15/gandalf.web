'use strict';

angular.module('app').controller('TablesEditController', function ($scope, $state, $log, $uibModal, $timeout, table) {
  var variantHash = 0;

  $scope.saved = true;
  $scope.isSaving = false;
  $scope.error = null;

  $scope.table = table;
  $scope.variant = $state.params.newVariant ? table.createVariant($state.params.variantId) : ($scope.variant || null);
  $scope.isBaseVariant = ($scope.variant.id === table.variants[0].id);

  variantHash = $scope.variant.getHash();

  $scope.submit = function (form) {
    if (form.$invalid) return;
    if ($scope.isSaving) return;

    $scope.isSaving = true;

    if ($state.params.newVariant && $scope.variant.id === undefined) {
      $scope.table.variants.push($scope.variant);
    }

    if ($scope.isBaseVariant) {
      table.title = $scope.variant.title;
      table.description = $scope.variant.description;
    }

    table.save().then(function () {
      $scope.error = null;
      $scope.variant.rules.forEach(function (item) {
        item.isEditing = false;
      });

      if ($state.params.newVariant) {
        $state.go('tables-details.edit', {
          variantId: $scope.table.variants[$scope.table.variants.length - 1].id
        });

        return;
      }

      $timeout(function () {
        $scope.saved = true;
      });

      $scope.variant = table.getVariant($scope.variant.id);
      $scope.$broadcast('decisionTable:saved');

      variantHash = $scope.variant.getHash();
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
      if ($scope.isBaseVariant) {
        table.delete().then(function () {
          $state.go('tables-list');
        });

        return;
      }

      table.deleteVariant($scope.variant.id);

      table.save().then(function () {
        $state.go('tables-details.edit', {
          variantId: $scope.table.variants[0].id
        });
      });
    });
  };

  $scope.$watch('variant', function (val) {
    $scope.saved = (val.getHash() === variantHash);
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
