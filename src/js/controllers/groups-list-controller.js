
angular.module('app').controller('GroupsListController', function ($scope, $timeout, $state, $stateParams, DecisionGroup) {

  $scope.tables = null;

  $scope.filters = {
    //tableId: $stateParams.tableId,
    page: $stateParams.page,
    size: $stateParams.size,
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

    DecisionGroup.find(val[0], val[1]).then(function (resp) {
      $scope.filters.total = resp.paging.total;
      $scope.groups = resp.data;
    });
  });
});
