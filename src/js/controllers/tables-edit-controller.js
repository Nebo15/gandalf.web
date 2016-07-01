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

  var changeDecisionType = {};
  changeDecisionType[APP.decisionTypes.string] = {
    transformFn: function (val) {
      return '' + val;
    }
  };
  changeDecisionType[APP.decisionTypes.numeric] = {
    transformFn: function (val) {
      val = Number(val);
      return isNaN(val) ? 0 : val;
    }
  };
  changeDecisionType[APP.decisionTypes.alphaNumeric] = {
    transformFn: function (val) {
      var reg = /[a-zA-Z0-9_-]+/gmi;
      return ('' + val).match(reg).join('')
    }
  };
  changeDecisionType[APP.decisionTypes.json] = {
    transformFn: function (val) {
      return JSON.parse(JSON.stringify(val));
    }
  };

  function transformDecisions(transformFn) {
    table.variants.forEach(function (item) {
      item.defaultDecision = transformFn(item.defaultDecision);
      item.rules.forEach(function (item) {
        item.than = transformFn(item.than);
      });
    });
  }

  $scope.onChangeDecisionType = function (type) {
    var changeConfig = changeDecisionType[type] || {};
    var transformFn = changeConfig.transformFn || function (val) {
        return val
      };

    transformDecisions(transformFn);

    tableHash = table.getHash();

    table.save().then(null, function (error) {
      $scope.error = error;
    });
  };

  var changeMatchingType = {};
  changeMatchingType[APP.matchingTypes.all] = {
    decisionType: APP.decisionTypes.numeric,
    transformFn: function (val) {
      val = Number(val);
      return isNaN(val) ? 0 : val;
    }
  };
  changeMatchingType[APP.matchingTypes.first] = {
    decisionType: APP.decisionTypes.alphaNumeric,
    transformFn: function (val) {
      return '' + val;
    }
  };

  $scope.onChangeMatchingType = function (type) {
    var changeConfig = changeMatchingType[type] || {};
    var transformFn = changeConfig.transformFn || function (val) {
        return val
      };

    table.decisionType = changeConfig.decisionType;

    transformDecisions(transformFn);

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
