'use strict';


angular.module('app', [
  'ng-gandalf',
  'ui.router',
  'ngStorage',
  'ui.bootstrap'
]);

angular.module('app').controller('AddFieldController', function ($scope, $uibModalInstance, DecisionField) {

  var field = new DecisionField({
    type: 'string'
  });
  $scope.field = field;

  $scope.save = function (form) {
    if (form.$invalid) return;
    $uibModalInstance.close(field);
  };
  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
});


angular.module('app').controller('MainController', function ($scope, $uibModal, DecisionTable, DecisionField, DecisionRule) {

  var table = null;
  DecisionTable.current().then(function (resp) {
    table = resp;
    $scope.table = resp;
  });

  $scope.addNewField = function () {

    var modalInstance = $uibModal.open({
      templateUrl: 'templates/modal/add-field.html',
      controller: 'AddFieldController'
    });
    modalInstance.result.then(function (newField) {
      table.addField(newField);
    });

  };
  $scope.addNewRule = function () {

    var rule = DecisionRule.fromFields(table.fields, {
      priority: table.rules.length
    }); // can be different

    table.addRule(rule);
  };

  $scope.save = function () {
    table.save().then(function () {

    })
  }

});
