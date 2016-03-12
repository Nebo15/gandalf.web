'use strict';

angular.module('app').directive('decisionInput', function () {
  return {
    restrict: 'E',
    scope: {
      type: '='
    },
    templateUrl: 'templates/directives/decision-input.html',
    controller: 'DecisionInputController'
  };
}).service('DecisionInputService', function (_) {

  var decisions = [];
  this.addDecision = function (decision) {
    decisions = _.unique(decision);
  };
  this.getDecisions = function () {
    return decisions;
  }
}).controller('DecisionInputController', function ($scope, DecisionInputService) {

  $scope.decisions = DecisionInputService.getDecisions();

});
