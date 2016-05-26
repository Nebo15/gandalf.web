angular.module('ng-gandalf').factory('DecisionRule', function (DecisionRuleCondition, gandalfUtils) {


  function Rule (obj) {
    var options = obj ? angular.copy(obj) : {};

    this.id = options._id || gandalfUtils.objectId();
    this.priority = options.priority;
    this.than = options.than;
    this.title = options.title;
    this.description = options.description;
    this.conditions = (options.conditions || []).map(function (item) {
      return new this._modelCondition(item);
    }.bind(this));
  }

  Rule.prototype = Object.create({}, {
    _modelCondition: {
      value: DecisionRuleCondition
    }
  });

  Rule.prototype.addCondition = function (field) {
    this.conditions.push(this._modelCondition.fromField(field))
  };
  Rule.prototype.removeConditionByField = function (field) {
    this.conditions = this.conditions.filter(function (item) {
      return item.fieldKey !== field.key;
    });
  };
  Rule.prototype.removeConditionByIndex = function (idx) {
    if (idx > -1) {
      this.conditions.splice(idx, 1);
    }
  };

  Rule.prototype.toJSON = function () {
    return {
      _id: this.id,
      priority: this.priority,
      than: this.than,
      title: gandalfUtils.orNull(this.title),
      description: gandalfUtils.orNull(this.description),
      conditions: JSON.parse(JSON.stringify(this.conditions))
    };
  };
  Rule.prototype.clone = function () {
    var obj = this.toJSON();
    delete obj._id;
    return new Rule(obj);
  };

  Rule.fromFields = function (fields, options) {
    var rule = new this(options);
    fields.forEach(function (item) {
      rule.addCondition(item);
    });
    return rule;
  };

  return Rule;

});

