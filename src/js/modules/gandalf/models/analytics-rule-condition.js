angular.module('ng-gandalf').factory('AnalyticsRuleCondition', function (DecisionRuleCondition) {

  function AnalyticsRuleCondition (data) {

    DecisionRuleCondition.apply(this, arguments);

    this.probability = data.probability;
    this.requests = data.requests;
  }

  AnalyticsRuleCondition.prototype = Object.create(DecisionRuleCondition.prototype);
  AnalyticsRuleCondition.prototype.constructor = AnalyticsRuleCondition;

  AnalyticsRuleCondition.prototype.toJSON = function () {
    var res = DecisionRuleCondition.prototype.toJSON.call(this);

    res.probability = this.probability;
    res.requests = this.requests;

    return res;
  };

  return AnalyticsRuleCondition;
});

