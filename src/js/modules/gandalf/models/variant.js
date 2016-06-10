angular.module('ng-gandalf').factory('DecisionVariant', function ($gandalf, $q, _, DecisionRule, CONDITION_TYPES, gandalfUtils) {

  function DecisionVariant (data) {

    this.rules = [];

    if (data) this.parse(data);
  }

  DecisionVariant.prototype = Object.create({}, {
    _modelRule: {
      value: DecisionRule
    }
  });

  DecisionVariant.prototype.parse = function (data) {

    this.id = data._id;

    var self = this;
    this.rules = (data.rules || []).map(function (item) {
      return new self._modelRule(item);
    });

    this.defaultDecision = data.default_decision;
    this.defaultTitle = data.default_title;
    this.defaultDescription = data.default_description;

    this.title = data.title;
    this.description = data.description;

    this.probability = Number(data.probability);

    return this;
  };

  DecisionVariant.prototype.toJSON = function () {
    return {
      _id: this.id,
      rules: JSON.parse(JSON.stringify(this.rules)),
      default_decision: this.defaultDecision,
      default_title: this.defaultTitle,
      default_description: this.defaultDescription,
      title: this.title,
      description: this.description,
      probability: this.probability
    };
  };

  DecisionVariant.prototype.createRule = function (fields) {
    if (!fields) return;

    var rule = this._modelRule.fromFields(fields); // can be different

    rule.conditions.forEach(function (condition) {
      condition.condition = CONDITION_TYPES.IS_SET;
    });
    rule.priority = this.rules.length;
    rule.than = this.defaultDecision;

    this.addRule(rule);
    return rule;
  };
  DecisionVariant.prototype.addRule = function (rule) {
    this.rules.push(rule);
  };

  DecisionVariant.prototype.copyRule = function (rule) {
    var idx = this.rules.indexOf(rule);
    if (idx == -1) throw new Error('copy rule not found in table rules', rule);
    var newRule = rule.clone();
    this.rules.splice(++idx, 0, newRule);
    return this;
  };

  DecisionVariant.prototype.deleteRule = function (rule) {
    this.rules = this.rules.filter(function (item) {
      return item !== rule;
    })
  };

  DecisionVariant.prototype.numberOfRules = function () {
    return this.rules.filter(function (item) {
      return !item.isDeleted;
    })
  };

  DecisionVariant.prototype.clear = function () {
    var self = this;
    this.rules.filter(function (item) {
      return item.isDeleted;
    }).forEach(function (item) {
      self.deleteRule(item);
    });
  };

  DecisionVariant.prototype.cleanRules = function (fields) {
    this.rules = [];
    this.createRule(fields);
  };

  DecisionVariant.prototype.getHash = function () {
    return gandalfUtils.stringHash(JSON.stringify(this.toJSON()));
  };


  return DecisionVariant;

});

