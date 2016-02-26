
angular.module('app').controller('DecisionListController', function ($scope, $timeout, $state, $stateParams, DecisionTable) {

  $scope.tables = null;

  $scope.filters = {
    //tableId: $stateParams.tableId,
    page: $stateParams.page,
    size: $stateParams.size || 5,
    total: undefined
  };

  $scope.$watchGroup(['filters.size','filters.page'], function (val) {

    $state.go($state.current.name, {
      size: val[0],
      page: val[1]
    }, {
      notify: false,
      reload: false,
      location: 'replace'
    });

    DecisionTable.find(val[0], val[1]).then(function (resp) {
      console.log('resp', resp, resp.data);
      $scope.filters.total = resp.paging.total;
      $scope.tables = resp.data;
    });
  });
});
