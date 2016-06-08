angular.module('ng-gandalf').factory('AnalyticsVariant', function (DecisionVariant, AnalyticsRule) {

  function AnalyticsVariant () {
    DecisionVariant.apply(this, arguments);
  }

  AnalyticsVariant.prototype = Object.create(DecisionVariant.prototype, {
    _modelRule: {
      value: AnalyticsRule
    }
  });

  AnalyticsVariant.prototype.constructor = DecisionVariant;

  return AnalyticsVariant;

});

