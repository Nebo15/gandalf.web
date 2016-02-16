'use strict';

angular.module('ng-gandalf', []).service('$gandalf', function ($http, $q) {

  this.get = function (decisionTableId) {
    return $http.get('data/api.json').then(function (resp) {
      return resp.data;
    });
  };
  this.history = function (count, page) {
    return $http.get('data/history.json').then(function (resp) {
      return resp.data;
    });
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
    this.result = options.decision;
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
}).factory('DecisionTable', function ($gandalf, $q, DecisionField, DecisionRule) {

  function DecisionTable (id, data) {
    this.id = id;
    this.fields = [];
    this.rules = [];
    this.defaultResult = null;

    if (data) this.parse(data);
  }

  DecisionTable.prototype.fetch = function () {
    return $gandalf.get(this.id).then(function (resp) {
      return this.parse(resp);
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
    return $gandalf.update(angular.toJson(this)); //placeholder
  };

  DecisionTable.prototype.parse = function (data) {

    this.id = data._id;

    this.fields = data.fields.map(function (item) {
      return new DecisionField(item);
    });
    this.rules = data.rules.map(function (item) {
      return new DecisionRule(item);
    });

    this.defaultResult = data.default_decision;

    return this;
  };

  DecisionTable.current = function () {
    return new DecisionTable().fetch();
  };

  DecisionTable.find = function (size, page) {
    var self = this;
    return $gandalf.history(size, page).then(function (resp) {
      resp.data = resp.data.map(function (item) {
        return new self(item.id, item);
      });
      return resp;
    });
  };

  return DecisionTable;

});
