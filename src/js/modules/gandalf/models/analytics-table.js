angular.module('ng-gandalf').factory('AnalyticsTable', function ($gandalf, DecisionTable, AnalyticsRuleCondition) {

  function AnalyticsTable() {

    DecisionTable.apply(this, arguments);
  }

  AnalyticsTable.prototype = Object.create(DecisionTable.prototype, {
    _modelRule: {
      value: AnalyticsRuleCondition
    }
  });
  AnalyticsTable.prototype.constructor = AnalyticsTable;

  AnalyticsTable.prototype.fetch = function () {
    return $gandalf.admin.getTableAnalytics(this.id).then(function (resp) {
      return this.parse(resp.data);
    }.bind(this))
  };
  AnalyticsTable.byId = function (id) {
    var table = new this(id);
    return table.fetch();
  };

  return AnalyticsTable;

});
