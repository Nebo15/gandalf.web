angular.module('app').controller('HistoryDetailsController', function ($scope, $stateParams, historyResult) {

  $scope.table = historyResult;

});
