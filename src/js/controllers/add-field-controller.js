'use strict';

angular.module('app').controller('AddFieldController', function ($scope, $uibModalInstance, DecisionField, field) {

  var field = field || new DecisionField({
    type: 'string',
    source: 'request'
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
