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

    this.alias = options.alias;
    this.type = options.type;
    this.title = options.title;

    this.source = options.source;

    this.defaultValue = options.defaultValue;
  }

  return DecisionField;
}).factory('DecisionRule', function () {

  function guid() {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
      s4() + '-' + s4() + s4() + s4();
  }

  function Rule (obj) {
    var options = obj ? angular.copy(obj) : {};

    this.id = options.id || guid();
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
  Rule.prototype.edit = function () {
    this.isEditing = true;
  };
  Rule.prototype.save = function () {
    this.isEditing = false;
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

    this.field_alias = options.field_alias;
    this.condition = options.condition;
    this.value = options.value;
  }
  return Rule;
}).factory('DecisionTable', function ($gandlaf, $q) {

  function DecisionTable (id) {
    this.id = id;
    this.fields = [];
    this.rules = [];
    this.defaultResult = null;
  }

  DecisionTable.prototype.fetch = function () {
    return $gandlaf.get(this.id).then(function (resp) {
      this.fields = resp.fields;
      this.rules = resp.rules;
      this.defaultResult = resp.defaultResult;

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
  DecisionTable.prototype.deleteRule = function (rule) {
    this.rules = this.rules.filter(function (item) {
      return item.id !== rule.id;
    })
  };

  DecisionTable.prototype.save = function () {
    return $gandlaf.update(angular.toJson(this)); //placeholder
  };

  DecisionTable.current = function () {
    return new DecisionTable().fetch();
  };

  return DecisionTable;

});
