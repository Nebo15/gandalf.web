angular.module('ng-gandalf').factory('HistoryRuleCondition', function (DecisionRuleCondition) {

  function HistoryRuleCondition (data) {

    DecisionRuleCondition.apply(this, arguments);

    this.matched = data.matched || false;
  }

  HistoryRuleCondition.prototype = Object.create(DecisionRuleCondition.prototype);
  HistoryRuleCondition.prototype.constructor = HistoryRuleCondition;

  HistoryRuleCondition.prototype.toJSON = function () {
    var res = DecisionRuleCondition.prototype.toJSON.call(this);
    res.matched = this.matched;

    return res;
  };

  return HistoryRuleCondition;
});

