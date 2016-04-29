angular.module('app').controller('TablesRevisionsController', function ($scope, decision) {

  $scope.table = decision;

  decision.getChangelogs().then(function (resp) {
    $scope.changelogs = resp;
  });

  $scope.rollbackChangelog = function (changelog) {
    return changelog.rollback().then(function () {
      return decision.fetch()
    });
  };

});
