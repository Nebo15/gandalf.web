'use strict';


angular.module('app', [
  'ng-gandalf'
]);

angular.module('app').service('Store', function ($sessionStorage, $gandlaf) {

  var storage = $sessionStorage.$default({
    'rules': [],
    'conditions': []
  });

  this.fetch = function () {
    return $gandlaf.get().then(function (resp) {
      storage.conditions = resp.fields;
      storage.rules = resp.rules;
      return storage;
    });
  };
  this.get = function () {
    return storage;
  };
});

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
