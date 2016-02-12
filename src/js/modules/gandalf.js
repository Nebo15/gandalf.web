'use strict';

angular.module('ng-gandalf', []).service('$gandlaf', function ($http, Condition, Rule) {

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
    this.description = options.description;
    this.conditions = (options.conditions || []).map(function (item) {
      return new RuleCondition(item);
    });
  }
  Rule.prototype.addCondition = function (condition) {
    this.conditions.push(new RuleCondition({
      name: condition.name
    }))
  };

  Rule.fromConditions = function (conditions, options) {
    var rule = new Rule(options);
    conditions.forEach(function (item) {
      rule.addCondition(item);
    });
    return rule;
  };

  function RuleCondition (obj) {
    var options = obj ? angular.copy(obj) : {};

    this.field_name = options.field_name;
    this.condition = options.condition;
    this.value = options.value;
  }
  return Rule;
});
