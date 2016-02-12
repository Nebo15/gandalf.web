'use strict';


angular.module('app', [
  'scoring'
]);

angular.module('scoring', []).service('$scoring', function ($http, Condition, Rule) {

  this.get = function () {
    return $http.get('data/api.json').then(function (resp) {
      return resp.data;
    }).then(function (data) {
      data.fields = data.fields.map(function (item) {
        return new Condition(item);
      });
      data.rules = data.rules.map(function (item) {
        return new Rule(item);
      });
      return data;
    })
  }
}).factory('Condition', function () {

  function Condition (obj) {
    var options = obj ? angular.copy(obj) : {};

    this.name = options.name;
    this.type = options.type;
    this.title = options.title;
    this.source = options.source;
  }

  return Condition;
}).factory('Rule', function () {

  function Rule (obj) {
    var options = obj ? angular.copy(obj) : {};

    this.id = options.id;
    this.priority = options.priority;
    this.result = options.result;
    this.conditions = (options.conditions || []).map(function (item) {
      return new RuleCondition(item);
    });
  }

  function RuleCondition (obj) {
    var options = obj ? angular.copy(obj) : {};

    this.field_name = options.field_name;
    this.condition = options.condition;
    this.value = options.value;
  }
  return Rule;
});


angular.module('app').controller('MainController', function ($scope, $scoring, Condition) {

  $scope.conditions = [];
  $scope.rules = [];

  $scoring.get().then(function (resp) {
    $scope.conditions = resp.fields;
    $scope.rules = resp.rules;
  });

  $scope.addNewCondition = function () {
    $scope.conditions.push(new Condition());
  }

});
