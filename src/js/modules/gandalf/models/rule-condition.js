angular.module('ng-gandalf').factory('DecisionRuleCondition', function (utils) {

  function RuleCondition (obj) {
    var options = obj ? angular.copy(obj) : {};

    this.field_alias = options.field_key;
    this.value = options.value;

    this.condition = options.condition ? options.condition : options.value ? '$eq' : '$is_set';

  }
  RuleCondition.prototype.toJSON = function () {
    var res = {
      field_key: this.field_alias,
      condition: utils.orNull(this.condition),
      value: utils.orNull(this.value)
    };
    if (res.condition == '$is_set') {
      res.value = true; // Because @bardack and @samorai have said what it is a good way
    }
    return res;
  };
  RuleCondition.prototype.reset = function () {
    this.value = true;
    this.condition = '$is_set';
  };

  RuleCondition.fromField = function (field) {
    var cond = new this();
    cond.field_alias = field.alias;

    return cond;
  };

  return RuleCondition;
});

