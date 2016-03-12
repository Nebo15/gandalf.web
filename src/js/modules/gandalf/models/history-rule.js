angular.module('ng-gandalf').factory('DecisionHistoryRule', function (DecisionRule, HistoryRuleCondition) {

  function HistoryRule (data) {
    DecisionRule.apply(this, arguments);
    if (data) {
      this.finalDecision = data.decision;
    }
  }

  HistoryRule.prototype = Object.create(DecisionRule.prototype, {
    _modelCondition: {
      value: HistoryRuleCondition
    }
  });

  HistoryRule.prototype.constructor = HistoryRule;

  return HistoryRule;

});

