'use strict';

angular.module('ng-gandalf', []).service('$gandlaf', function ($http, $q, DecisionField, DecisionRule) {

  this.get = function (decisionTableId) {
    return $http.get('data/api.json').then(function (resp) {
      return resp.data;
    }).then(function (data) {
      data.fields = data.fields.map(function (item) {
        return new DecisionField(item);
      });
      data.rules = data.rules.map(function (item) {
        return new DecisionRule(item);
      });
      return data;
    })
  };
  this.update = function (decisionTableObj) {
    return $q.when(decisionTableObj);
  };

}).factory('DecisionField', function () {

  function DecisionField (obj) {
    var options = obj ? angular.copy(obj) : {};

    this.name = options.name;
    this.type = options.type;
    this.title = options.title;
    this.source = options.source;
  }

  return DecisionField;
}).factory('DecisionRule', function () {

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
  Rule.prototype.addCondition = function (field) {
    this.conditions.push(new RuleCondition({
      name: field.name
    }))
  };

  Rule.fromFields = function (fields, options) {
    var rule = new Rule(options);
    fields.forEach(function (item) {
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
}).factory('DecisionTable', function ($gandlaf, $q) {

  function DecisionTable (id) {
    this.id = id;
    this.fields = [];
    this.rules = [];
  }

  DecisionTable.prototype.fetch = function () {
    return $gandlaf.get(this.id).then(function (resp) {
      this.fields = resp.fields;
      this.rules = resp.rules;

      return this;
    }.bind(this))
  };

  DecisionTable.prototype.addField = function (field) {
    this.fields.push(field);
    this.rules.forEach(function (item) {
      item.addCondition(field);
    });
  };

  DecisionTable.prototype.addRule = function (rule) {
    this.rules.push(rule);
  };

  DecisionTable.prototype.save = function () {
    return $gandlaf.update(this); //placeholder
  };

  DecisionTable.current = function () {
    return new DecisionTable().fetch();
  };

  return DecisionTable;

});
