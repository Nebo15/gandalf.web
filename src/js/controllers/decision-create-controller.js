'use strict';

angular.module('app').controller('DecisionCreateController', function ($scope, $controller, $state, DecisionTable) {

  $controller('DecisionDetailsController', {
    $scope: $scope,
    decision: new DecisionTable()
  }); //This works

  $scope.save = function () {
    console.log('create');
    $scope.table.create().then(function (resp) {
      $state.go('decision-details', {id: resp.id});
    }).catch(function (resp) {
      console.warn('error create', resp);
    })
  }

});
