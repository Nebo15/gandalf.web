"use strict";

angular.module('app').controller('groupEditController', function ($scope, group, $uibModalInstance) {

  $scope.group = angular.copy(group); // from directive scope
  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
  $scope.save = function (form) {
    if (form.$invalid) return;
    group.update($scope.group).then(function () {
      $uibModalInstance.dismiss('cancel');
    });
  };
});

angular.module('app').directive('groupEdit', function ($uibModal) {
  return {
    restrict: 'EA',
    scope: {
      group: '=groupEdit'
    },
    link: function (scope, el, attrs) {
      el.bind('click', function () {
        $uibModal.open({
          templateUrl: 'templates/modal/group-edit.html',
          controller: 'groupEditController',
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
