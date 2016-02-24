'use strict';

angular.module('app').controller('AddFieldController', function ($scope, $uibModalInstance, DecisionField, field) {

  var fieldModel = field || new DecisionField({
    type: 'string',
    source: 'request'
  });

  $scope.startField = angular.copy(field);
  $scope.field = fieldModel;

  $scope.isTypeChanged = function () {
    return $scope.startField && $scope.field.type !== $scope.startField.type;
  };

  $scope.save = function (form) {
    if (form.$invalid) return;

    fieldModel.typeChanged = $scope.isTypeChanged();
    $uibModalInstance.close(fieldModel);
  };
  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
});
