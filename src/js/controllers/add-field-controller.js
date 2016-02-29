'use strict';

angular.module('app').controller('AddFieldController', function ($scope, $uibModalInstance, DecisionField, field, table) {

  var fieldModel = field || new DecisionField({
    type: 'string',
    source: 'request'
  });

  $scope.startField = angular.copy(field);
  $scope.field = fieldModel;

  $scope.sameKeyColumns = [];
  $scope.sameKeyColumnsType = null;
  $scope.$watch('field.alias', function (val) {
    $scope.sameKeyColumns = table.fields.filter(function (item) {
      return item.alias === val && item !== fieldModel;
    });
    $scope.sameKeyColumnsType = ($scope.sameKeyColumns[0] || {}).type;
  });
  $scope.hasDifferentType = function () {
    return $scope.sameKeyColumnsType && $scope.field.type !== $scope.sameKeyColumnsType;
  };

  $scope.isEdit = !!$scope.startField;
  $scope.isEnablePreset = !!$scope.field.preset;

  $scope.isTypeChanged = function () {
    return $scope.startField && $scope.field.type !== $scope.startField.type;
  };
  $scope.isPresetChanged = function () {
    return $scope.startField && !$scope.field.preset !== !$scope.startField.preset; // exist and not exist
  };

  $scope.delete = function () {
    fieldModel.isDeleted = true;
    $uibModalInstance.close(fieldModel);
  };
  $scope.revert = function () {
    fieldModel.isDeleted = false;
  };
  $scope.save = function (form) {
    if (form.$invalid) return;

    if (!$scope.isEnablePreset) {
      $scope.field.preset = null;
    }

    // same type if the fields with the same alias
    if ($scope.sameKeyColumns && $scope.field.type !== $scope.sameKeyColumnsType) {
      $scope.sameKeyColumns.forEach(function (field) {
        field.type = $scope.field.type;
        table.findConditionsByField(field).forEach(function (item) {
          item.reset();
        });
      })
    }
    fieldModel.typeChanged = $scope.isTypeChanged() || $scope.isPresetChanged(); // will clear values in a rules
    $uibModalInstance.close(fieldModel);
  };
  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
});
