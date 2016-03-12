angular.module('ng-gandalf').factory('DecisionTable', function ($gandalf, $q, _, DecisionField, DecisionRule) {

  function DecisionTable (id, data) {
    this.id = id;
    this.fields = [];
    this.rules = [];
    this.defaultResult = null;
    this.defaultTitle = null;
    this.defaultDescription = null;
    this.matchingType = 'first';

    if (data) this.parse(data);
  }
  DecisionTable.prototype = Object.create({}, {
    _modelRule: {
      value: DecisionRule
    },
    _modelField: {
      value: DecisionField
    }
  });

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
  DecisionTable.prototype.deleteField = function (field) {
    var fieldIdx = this.fields.indexOf(field);
    this.fields = this.fields.filter(function (item) {
      return item !== field;
    });
    this.rules.forEach(function (item) {
      item.removeConditionByIndex(fieldIdx);
    })
  };

  DecisionTable.prototype.addRule = function (rule) {
    this.rules.push(rule);
  };
  DecisionTable.prototype.copyRule = function (rule) {
    var idx = this.rules.indexOf(rule);
    if (idx == -1) throw new Error('copy rule not found in table rules');
    var newRule = rule.clone();
    this.rules.splice(++idx, 0, newRule);
    return this;
  };

  DecisionTable.prototype.deleteRule = function (rule) {
    this.rules = this.rules.filter(function (item) {
      return item !== rule;
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
    this.fields.filter(function (item) {
      return item.isDeleted;
    }).forEach(function (field) {
      console.log('delete', field);
      this.deleteField(field);
    }.bind(this));

    return $gandalf.updateDecisionById(this.id, this);
  };
  DecisionTable.prototype.create = function () {
    return $gandalf.createDecision(this).then(function (obj) {
      this.id = obj.data._id;
      return this;
    }.bind(this));
  };

  DecisionTable.prototype.delete = function () {
    return $gandalf.deleteDecisionById(this.id);
  };

  DecisionTable.prototype.parse = function (data) {

    this.id = data._id;

    this.fields = (data.fields || []).map(function (item) {
      return new this._modelField(item);
    }.bind(this));
    this.rules = (data.rules || []).map(function (item) {
      return new this._modelRule(item);
    }.bind(this));

    this.matchingType = data.matching_type || 'first';
    this.defaultResult = data.default_decision;
    this.defaultTitle = data.default_title;
    this.defaultDescription = data.default_description;

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
      default_title: this.defaultTitle,
      default_description: this.defaultDescription,
      title: this.title,
      description: this.description,
      matching_type: this.matchingType
    };
  };

  DecisionTable.prototype.getDecisionVariants = function () {

    var variants = this.rules.map(function (item) { return item.decision; });
    if (this.defaultResult) {
      variants.push(this.defaultResult);
    }
    return _.uniq(variants);
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

