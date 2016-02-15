'use strict';


angular.module('app', [
  'ng-gandalf',
  'ui.router',
  'ngStorage',
  'ui.bootstrap'
]);

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

    var rule = DecisionRule.fromFields(table.fields, {
      priority: table.fields.length
    }); // can be different

    table.addRule(rule);
  };

  $scope.save = function () {
    table.save().then(function () {

    })
  }

});
