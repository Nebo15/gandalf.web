
angular.module('app').controller('HistoryListController', function ($scope, $state, $stateParams, selectedTable, DecisionHistoryTable, DecisionTable) {

  $scope.tables = [];
  $scope.filters = {
    tableId: $stateParams.tableId,
    page: $stateParams.page,
    size: $stateParams.size,
    total: null,
    table: selectedTable
  };

  $scope.onSelectTable = function (item) {
    $scope.filters.table = item;
    $scope.filters.tableId = item.id;
  };

  $scope.searchHistories = function (title) {
    return DecisionTable.find(10, 0, {
      title: title
    }).then(function (resp) {
      return resp.data;
    });
  };

  $scope.$watch('filters.table.title', function (val) {
    if (val !== undefined && val.length === 0 && $scope.filters.tableId) {
      $scope.filters.tableId = undefined;
    }
  });

  $scope.$watchGroup(['filters.tableId','filters.size','filters.page'], function (val) {

    $state.go($state.current.name, {
      tableId: val[0],
      size: val[1],
      page: val[2]
    }, {
      notify: false,
      reload: false,
      location: 'replace'
    });

    DecisionHistoryTable.find(val[0], val[1], val[2]).then(function (resp) {
      $scope.filters.total = resp.paging.total;
      $scope.tables = resp.data;
    });
  });

  $scope.toggleExpandTable = function (table) {
    table.isExpanded = !table.isExpanded;
  };

});
