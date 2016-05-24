"use strict";

angular.module('app').controller('groupDeleteController', function ($scope, $state, group, $uibModalInstance) {

  $scope.group = angular.copy(group); // from directive scope
  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
  $scope.submit = function (form) {
    if (form.$invalid) return;
    group.delete().then(function () {
      $state.go('groups-list');
      $uibModalInstance.dismiss('cancel');
    });
  };
});

angular.module('app').directive('groupDelete', function ($uibModal) {
  return {
    restrict: 'EA',
    scope: {
      group: '=groupDelete'
    },
    link: function (scope, el, attrs) {
      el.bind('click', function () {
        $uibModal.open({
          templateUrl: 'templates/modal/group-delete.html',
          controller: 'groupDeleteController',
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
