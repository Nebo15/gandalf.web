
angular.module('app').controller('HistoryListController', function ($scope, $state, $stateParams, DecisionHistoryTable) {

  $scope.tables = [];
  $scope.filters = {
    tableId: $stateParams.tableId,
    page: $stateParams.page,
    size: $stateParams.size,
    total: null
  };

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
