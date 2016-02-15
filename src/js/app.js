'use strict';


angular.module('app', [
  'ng-gandalf'
]);

angular.module('app').factory('DecisionTable', function ($gandlaf) {

  function DecisionTable (id) {
    this.id = id;
    this.fields = [];
    this.rules = [];
  }

  DecisionTable.prototype.fetch = function () {
    return $gandlaf.get(this.id).then(function (resp) {
      this.fields = resp.fields;
      this.rules = resp.rules;

      return this;
    }.bind(this))
  };

  DecisionTable.prototype.addField = function (field) {
    this.fields.push(field);
    this.rules.forEach(function (item) {
      item.addCondition(field);
    });
  };

  DecisionTable.current = function () {
    return new DecisionTable().fetch();
  };

  return DecisionTable;

});

angular.module('app').controller('MainController', function ($scope, DecisionTable, DecisionField, DecisionRule) {

  var table = null;
  DecisionTable.current().then(function (resp) {
    table = resp;
    $scope.table = resp;
  });

  $scope.addNewField = function () {
    var newCondition = new DecisionField({
      title: 'new name'
    });

    table.addField(newCondition);
  };
  $scope.addNewRule = function () {
    table.rules.push(DecisionRule.fromFields(table.fields, {
      priority: table.fields.length
    }));
  };

  $scope.save = function () {

  }

});
