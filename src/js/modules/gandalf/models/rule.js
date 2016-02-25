angular.module('ng-gandalf').factory('DecisionRule', function (DecisionRuleCondition) {

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
    this.decision = options.than;
    this.description = options.description;
    this.conditions = (options.conditions || []).map(function (item) {
      return new this.models.condition(item);
    }.bind(this));
  }

  Rule.prototype.models = {
    condition: DecisionRuleCondition
  };

  Rule.prototype.addCondition = function (field) {
    this.conditions.push(this.models.condition.fromField(field))
  };
  Rule.prototype.edit = function () {
    this.isEditing = true;
  };
  Rule.prototype.save = function () {
    this.isEditing = false;
  };

  Rule.prototype.toJSON = function () {
    return {
      id: this.id,
      priority: this.priority,
      than: this.decision,
      description: utils.orNull(this.description),
      conditions: JSON.parse(JSON.stringify(this.conditions))
    };
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

