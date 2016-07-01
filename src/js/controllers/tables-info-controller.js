'use strict';

angular.module('app').controller('TablesInfoController', function ($scope, $state, $uibModal, table) {
  var tableHash = table.getHash();

  $scope.saved = true;
  $scope.isSaving = false;
  $scope.error = null;
  $scope.allTraffic = 100;

  $scope.table = table;

  function sumVariants() {
    var filterIndexes = Array.prototype.slice.call(arguments);

    return table.variants.reduce(function (num, variant, index) {
      if (~filterIndexes.indexOf(index)) {
        return num;
      }

      return num += variant.probability;
    }, 0);
  }

  $scope.maxTrafficPercent = function (currentIndex) {
    return 100 - sumVariants(0, currentIndex);
  };

  $scope.saveTrafficAllocation = function (form) {
    $scope.error = null;
    $scope.isSaving = true;

    if (form.$invalid || $scope.saved) return;

    table.variants[0].probability = $scope.allTraffic;

    table.save().then(function () {
      $scope.saved = true;
      $scope.isSaving = false;

      tableHash = table.getHash();
    }).then(null, function (err) {
      $scope.error = err;
    });
  };


  $scope.onChangeDecisionType = function (type) {
    table.setDecisionType (type);
    tableHash = table.getHash();

    table.save().then(null, function (error) {
      $scope.error = error;
    });
  };


  $scope.onChangeMatchingType = function (type) {
    table.setMatchingType(type);
    tableHash = table.getHash();

    table.save().then(null, function (error) {
      $scope.error = error;
    });
  };

  $scope.changeTableName = function () {
    var modalInstance = $uibModal.open({
      templateUrl: 'templates/modal/edit-table-name.html',
      controller: 'EditTableNameController',
      resolve: {
        table: table
      }
    });

    modalInstance.result.then(function (tableCopy) {
      $scope.table.title = tableCopy.title;
      $scope.table.description = tableCopy.description;

      tableHash = table.getHash();
      return $scope.table.save();
    });
  };

  $scope.$watch('table.variants', function () {
    var sum = sumVariants(0);
    $scope.allTraffic = 100 - (isNaN(sum) ? 0 : sum);
  }, true);

  $scope.$watch('table', function () {
    $scope.saved = (tableHash === table.getHash());
  }, true);

});
