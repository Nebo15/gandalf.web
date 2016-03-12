'use strict';

angular.module('app').directive('addNewField', function () {
  return {
    restrict: 'E',
    scope: {
      table: '='
    },
    link: function (scope, el, attrs, ctrl) {
      el.bind('click', function () {
        scope.openAdd();
      });
    },
    controller: function ($scope, $uibModal) {
      $scope.openAdd = function () {
        var modalInstance = $uibModal.open({
          templateUrl: 'templates/modal/add-field.html',
          controller: 'AddFieldController',
          resolve: {
            field: function () {
              return null;
            },
            table: function () {
              return $scope.table;
            }
          }
        });
        modalInstance.result.then(function (newField) {
          $scope.table.addField(newField);
          $scope.table.findConditionsByField(field).forEach(function (item) {
            item.reset();
          });
        });
      }
    }
  }
});
