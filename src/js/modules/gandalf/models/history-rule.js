angular.module('ng-gandalf').factory('DecisionHistoryRule', function (DecisionRule, HistoryRuleCondition) {

  function HistoryRule () {
    DecisionRule.apply(this, arguments);
  }

  HistoryRule.prototype = Object.create(DecisionRule.prototype);
  HistoryRule.prototype.constructor = HistoryRule;

  HistoryRule.prototype.models.condition = HistoryRuleCondition;

  return HistoryRule;

});

