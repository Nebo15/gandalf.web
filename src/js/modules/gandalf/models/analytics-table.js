angular.module('ng-gandalf').factory('AnalyticsTable', function ($gandalf, DecisionTable, AnalyticsVariant) {

  function AnalyticsTable() {

    DecisionTable.apply(this, arguments);
  }

  AnalyticsTable.prototype = Object.create(DecisionTable.prototype, {
    _modelVariant: {
      value: AnalyticsVariant
    }
  });

  AnalyticsTable.prototype.constructor = AnalyticsTable;

  AnalyticsTable.byIdAndVariantId = function (id, variantId) {
    return $gandalf.admin.getTableAnalytics(id, variantId).then(function (data) {
      var table = new AnalyticsTable();
      table.parse(data);
      return table;
    })
  };

  return AnalyticsTable;

});
