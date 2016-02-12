'use strict';


angular.module('app', [
  'ng-gandalf'
]);

angular.module('app').controller('MainController', function ($scope, $gandlaf, Condition, Rule) {

  $scope.conditions = [];
  $scope.rules = [];

  $gandlaf.get().then(function (resp) {
    $scope.conditions = resp.fields;
    $scope.rules = resp.rules;
  });

  $scope.addNewCondition = function () {
    var newCondition = new Condition({
      title: 'new name'
    });
    $scope.conditions.push(newCondition);
    $scope.rules.forEach(function (item) {
      item.addCondition(newCondition);
    });
  };
  $scope.addNewRule = function () {
    $scope.rules.push(Rule.fromConditions($scope.conditions, {
      priority: $scope.rules.length
    }));
  }

});
