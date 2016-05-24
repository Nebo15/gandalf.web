"use strict";

angular.module('app').controller('groupTableAddController', function ($scope, group, $uibModalInstance) {

  $scope.group = group; // from directive scope
  $scope.model = {
    table: null,
    clean: null,
    title: null
  };
  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
  $scope.save = function (form) {
    if (form.$invalid) return;
    $scope.model.table.copy().then(function (clonedTable) {
      clonedTable.title = $scope.model.title;
      if ($scope.model.clean) {
        clonedTable.cleanRules(); // remove rules
      }
      console.log(clonedTable);
      return clonedTable.save();
    }).then(function (clonedTable) {
      // here we can specify amount of request fot a new table
      $scope.group.tables.push(clonedTable);
      return $scope.group.update();
    }).then(function () {
      $uibModalInstance.dismiss('cancel');
    })
  };
});

angular.module('app').directive('groupTableAdd', function ($uibModal) {
  return {
    restrict: 'EA',
    scope: {
      group: '=groupTableAdd'
    },
    link: function (scope, el) {
      el.bind('click', function () {
        $uibModal.open({
          templateUrl: 'templates/modal/group-table-add.html',
          controller: 'groupTableAddController',
          resolve: {
            group: function () {
              return scope.group;
            }
          }
        });
      })
    }
  };
});
