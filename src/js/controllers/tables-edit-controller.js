'use strict';

angular.module('app').controller('TablesEditController', function ($scope, $state, $uibModal, table, APP) {
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

  $scope.onChangeMatchingType = function (type) {
    var transformFn = function (val) {
      return val
    };

    switch (type) {
      case APP.matchingTypes.first:
        transformFn = function (val) {
          return '' + val;
        };
        break;
      case APP.matchingTypes.all:
        transformFn = function (val) {
          val = Number(val);
          return isNaN(val) ? 0 : val;
        };
        break;
    }

    table.variants.forEach(function (item) {
      item.defaultDecision = transformFn(item.defaultDecision);
      item.rules.forEach(function (item) {
        item.than = transformFn(item.than);
      });
    });

    table.matchingType = type;

    tableHash = table.getHash();

    table.save().then(null, function (error) {
      $scope.error = error;
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
