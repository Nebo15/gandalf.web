angular.module('app').controller('TablesRevisionsController', function ($scope, table, $state) {

  $scope.table = table;

  $scope.table.getChangelogs().then(function (resp) {
    $scope.changelogs = resp;
  });

  $scope.rollbackChangelog = function (changelog) {
    return changelog.rollback().then(function () {
      return $scope.table.fetch();
    }).then(function () {
      $state.go('^.edit');
    })
  };

});
