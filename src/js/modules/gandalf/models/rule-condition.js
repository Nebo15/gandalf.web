angular.module('ng-gandalf').factory('DecisionRuleCondition', function () {

  function RuleCondition (obj) {
    var options = obj ? angular.copy(obj) : {};

    this.field_alias = options.field_key;
    this.condition = options.condition || '$eq';
    this.value = options.value;
    this.matched = options.matched === true;
  }
  RuleCondition.prototype.toJSON = function () {
    return {
      field_key: this.field_alias,
      condition: utils.orNull(this.condition),
      value: utils.orNull(this.value),
      matched: this.matched
    };
  };
  RuleCondition.prototype.reset = function () {
    this.value = null;
  };

  RuleCondition.fromField = function (field) {
    var cond = new RuleCondition();
    cond.field_alias = field.alias;
    return cond;
  };

  return RuleCondition;
});

