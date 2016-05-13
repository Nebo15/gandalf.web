angular.module('ng-gandalf').factory('DecisionRuleCondition', function (gandalfUtils, CONDITION_OPTIONS) {

  function RuleCondition (obj) {
    var options = obj ? angular.copy(obj) : {};

    this.fieldKey = options.field_key;
    this.value = options.value;

    this.condition = options.condition ? options.condition : options.value ? '$eq' : '$is_set';

  }
  RuleCondition.prototype.toJSON = function () {
    var res = {
      field_key: this.fieldKey,
      condition: gandalfUtils.orNull(this.condition),
      value: gandalfUtils.orNull(this.value)
    };
    // not return is_set and is_null with undefined value field
    if (CONDITION_OPTIONS.hasNotValue.indexOf(res.condition) !== -1) {
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
    cond.fieldKey = field.key;

    return cond;
  };

  return RuleCondition;
});

