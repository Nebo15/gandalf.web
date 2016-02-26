
angular.module('app').controller('DecisionListController', function ($scope, $stateParams, DecisionTable) {

  $scope.tables = null;

  $scope.filters = {
    //tableId: $stateParams.tableId,
    page: $stateParams.page,
    size: $stateParams.size || 5,
    total: 0
  };

  $scope.$watchGroup(['filters.size','filters.page'], function (val) {


    DecisionTable.find(val[0], val[1]).then(function (resp) {
      console.log('resp', resp, resp.data);
      $scope.filters.total = resp.paging.total;
      $scope.tables = resp.data;
    });
  });
});
