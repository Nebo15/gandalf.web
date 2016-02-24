
angular.module('app').controller('HistoryListController', function ($scope, $stateParams, DecisionHistory) {

  $scope.tables = [];
  $scope.filters = {
    tableId: $stateParams.tableId,
    page: 0,
    size: undefined
  };

  DecisionHistory.find($scope.filters.tableId, $scope.filters.size, $scope.filters.page).then(function (resp) {
    $scope.tables = resp.data;
  });

  $scope.toggleExpandTable = function (table) {
    table.isExpanded = !table.isExpanded;
  };

});
