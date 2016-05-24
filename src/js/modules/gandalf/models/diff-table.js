
angular.module('ng-gandalf').factory('DecisionDiffTable', function ($gandalf, DecisionTable) {

  function normalizeArray (arrayObj, propId) {
    var res  = {};
    (arrayObj || []).forEach(function (item) {
      if (res[item[propId]]) {
        console.error('Duplicate item with %o', item[propId]);
      }
      res[item[propId]] = item;
    });

    return res;
  }
  function DecisionDiffTable () {

    DecisionTable.apply(this, arguments);
  }

  DecisionDiffTable.prototype = Object.create(DecisionTable.prototype);

  DecisionDiffTable.prototype.constructor = DecisionDiffTable;

  DecisionDiffTable.prototype.parse = function (data) {

    DecisionTable.prototype.parse.call(this, data);
    this.fieldsObj = normalizeArray(this.fields, 'id');
    this.rulesObj = normalizeArray(this.rules, 'id');

    var self = this;
    this.rules.forEach(function (rule) {

      rule.conditions.forEach(function (condition, i) {
        condition.fieldId = self.fields[i].id;
      });

    });

    return this;
  };

  return DecisionDiffTable;

});
