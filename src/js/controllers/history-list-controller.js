
angular.module('app').controller('HistoryListController', function ($scope, DecisionHistory) {

  $scope.tables = [];
  DecisionHistory.find().then(function (resp) {
    $scope.tables = resp.data;
  });

  $scope.toggleExpandTable = function (table) {
    table.isExpanded = !table.isExpanded;
  };

});
