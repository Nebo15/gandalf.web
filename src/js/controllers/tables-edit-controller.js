'use strict';

angular.module('app').controller('TablesEditController', function ($scope, $state, $log, $uibModal, $timeout, table, variant) {
  var tableHash = 0;

  $scope.saved = true;
  $scope.isSaving = false;
  $scope.error = null;

  $scope.table = table;
  $scope.variant = variant;

  tableHash = $scope.table.getHash();

  $scope.onChangeDecisionType = function (type) {
    table.setDecisionType (type);
  };

  $scope.onChangeMatchingType = function (type) {
    table.setMatchingType(type);
  };

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

      if (table.variants.length == 1) {
        table.variants[0].title = table.title;
        table.variants[0].description = table.description;
      }

      table.save().then(function (table) {
        $scope.selectVariant(table.variants[0]);
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
