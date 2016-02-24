
angular.module('app').controller('HistoryListController', function ($scope, $stateParams, DecisionHistory) {

  $scope.tables = [];
  $scope.filters = {
    tableId: $stateParams.tableId,
    page: $stateParams.page,
    size: $stateParams.size || 10,
    total: 0
  };

  $scope.$watchGroup(['filters.tableId','filters.size','filters.page'], function (val) {
    DecisionHistory.find(val[0], val[1], val[2]).then(function (resp) {
      $scope.filters.total = resp.paging.total;
      $scope.tables = resp.data;
    });
  });

  $scope.toggleExpandTable = function (table) {
    table.isExpanded = !table.isExpanded;
  };

});
