angular.module('ng-gandalf').factory('AnalyticsRule', function (DecisionRule, AnalyticsRuleCondition) {

  function AnalyticsRule (data) {
    DecisionRule.apply(this, arguments);
  }

  AnalyticsRule.prototype = Object.create(DecisionRule.prototype, {
    _modelCondition: {
      value: AnalyticsRuleCondition
    }
  });

  AnalyticsRule.prototype.constructor = AnalyticsRule;

  return AnalyticsRule;

});

