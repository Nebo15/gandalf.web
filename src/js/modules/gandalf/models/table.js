angular.module('ng-gandalf').factory('DecisionTable', function ($gandalf, $q, DecisionField, DecisionRule, DecisionRuleCondition) {

  function DecisionTable (id, data) {
    console.log('decision table', arguments);
    this.id = id;
    this.fields = [];
    this.rules = [];
    this.defaultResult = null;

    if (data) this.parse(data);
  }
  DecisionTable.prototype.models = {
    rule: DecisionRule,
    field: DecisionField
  };

  DecisionTable.prototype.fetch = function () {
    return $gandalf.decisionById(this.id).then(function (resp) {
      return this.parse(resp.data);
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

  DecisionTable.prototype.findConditionsByField = function (field) {
    return [].concat.apply([], this.rules.map(function (item) {
      return item.conditions;
    })).filter(function (condition) {
      return condition.field_alias === field.alias;
    });
  };

  DecisionTable.prototype.save = function () {
    return $gandalf.updateDecisionById(this.id, this);
  };
  DecisionTable.prototype.create = function () {
    return $gandalf.createDecision(this).then(function (obj) {
      this.id = obj.data._id;
      return this;
    }.bind(this));
  };

  DecisionTable.prototype.parse = function (data) {

    this.id = data._id;

    this.fields = (data.fields || []).map(function (item) {
      return new this.models.field(item);
    }.bind(this));
    this.rules = (data.rules || []).map(function (item) {
      return new this.models.rule(item);
    }.bind(this));

    this.defaultResult = data.default_decision;
    this.title = data.title;
    this.description = data.description;

    return this;
  };
  DecisionTable.prototype.toJSON = function () {
    return {
      _id: this.id,
      fields: JSON.parse(JSON.stringify(this.fields)),
      rules: JSON.parse(JSON.stringify(this.rules)),
      default_decision: this.defaultResult,
      title: this.title,
      description: this.description
    };
  };

  DecisionTable.find = function (size, page) {

    var self = this;
    return $gandalf.decisions(size, page).then(function (resp) {
      resp.data = resp.data.map(function (item) {
        return new self (null, item);
      });
      return resp;
    })
  };
  DecisionTable.byId = function (id) {
    var table = new this(id);
    return table.fetch();
  };

  return DecisionTable;

});

