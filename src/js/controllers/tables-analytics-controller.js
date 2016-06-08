angular.module('app').controller('TablesAnalyticsController', function ($scope, $stateParams, analytics) {

  $scope.table = analytics;
  $scope.variant = analytics.variants[0];

});
