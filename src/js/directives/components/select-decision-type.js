'use strict';

angular.module('app').directive('selectDecisionType', function () {
  return {
    restrict: 'E',
    template: '<div class="btn-group btn-group-matching">' +
      '<label class="btn btn-primary-matching" ng-model="matchingType" ng-change="onChangeMatchingType(matchingType)" uib-btn-radio="$root.APP.decisionTypes.alphaNumeric">Alphanumeric</label>' +
      '<label class="btn btn-primary-matching" ng-model="matchingType" ng-change="onChangeMatchingType(matchingType)" uib-btn-radio="$root.APP.decisionTypes.string">String</label>' +
      '<label class="btn btn-primary-matching" ng-model="matchingType" ng-change="onChangeMatchingType(matchingType)" uib-btn-radio="$root.APP.decisionTypes.numeric">Number</label>' +
    '<label class="btn btn-primary-matching" ng-model="matchingType" ng-change="onChangeMatchingType(matchingType)" uib-btn-radio="$root.APP.decisionTypes.json">JSON</label> ' +
    '</div>',
    scope: {
      model: '=ngModel',
      callback: '&',
      strict: '='
    },
    link: function (scope) {

      scope.matchingType = scope.model;
    },
    controller: 'SelectDecisionTypeController'
  }
}).controller('SelectDecisionTypeController', function ($scope, $log, $uibModal) {

  var modalInstance = null;
  $scope.onChangeMatchingType = function (newType) {
    if (!$scope.strict) return $scope.confirm();
    modalInstance = $uibModal.open({
      templateUrl: 'templates/modal/change-decision-type.html',
      scope: $scope
    });

  };
  $scope.cancel = function () {
    $scope.matchingType = $scope.model;
    if (modalInstance) modalInstance.close();
  };
  $scope.confirm = function () {
    if ($scope.callback()) {
      $scope.callback()($scope.matchingType);
    }
    $scope.model = $scope.matchingType;
    if (modalInstance) modalInstance.close();
  }

});
