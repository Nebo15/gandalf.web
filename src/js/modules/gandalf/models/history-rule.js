angular.module('ng-gandalf').factory('DecisionHistoryRule', function (DecisionRule, HistoryRuleCondition) {

  function HistoryRule () {
    DecisionRule.apply(this, arguments);
  }

  HistoryRule.prototype = Object.create(DecisionRule.prototype, {
    _modelCondition: {
      value: HistoryRuleCondition
    }
  });
  HistoryRule.prototype.constructor = HistoryRule;

  return HistoryRule;

});

