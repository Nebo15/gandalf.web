angular.module('app').controller('DecisionListController', function ($scope, $uibModal, DecisionTable) {

  $scope.tables = null;
  DecisionTable.find().then(function (resp) {
    $scope.tables = resp;
  });

});
