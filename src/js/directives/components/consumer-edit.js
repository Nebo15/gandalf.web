"use strict";

angular.module('app').controller('consumerEditController', function ($scope, project, consumer, $uibModalInstance, PROJECT_CONSUMER_SCOPES) {

  $scope.model = angular.copy(consumer); // from directive scope
  $scope.project = project; // from directive scope

  $scope.readonly = !project.hasUserAccess('consumers', 'manage');

  $scope.scopes = PROJECT_CONSUMER_SCOPES;
  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
  $scope.save = function (form) {
    if (form.$invalid) return;
    $scope.project.updateConsumer($scope.model).then(function () {
      $uibModalInstance.dismiss('cancel');
    });
  };
  $scope.remove = function () {
    $scope.project.removeConsumer($scope.model).then(function () {
      $uibModalInstance.dismiss('cancel');
    });
  }
});

angular.module('app').directive('consumerEdit', function ($uibModal) {
  return {
    restrict: 'EA',
    scope: {
      project: '=consumerEdit',
      consumer: '=consumerEditModel'
    },
    link: function (scope, el, attrs) {
      el.bind('click', function () {
        $uibModal.open({
          templateUrl: 'templates/modal/consumer-edit.html',
          controller: 'consumerEditController',
          resolve: {
            project: function () {
              return scope.project;
            },
            consumer: function () {
              return scope.consumer;
            }
          }
        });
      })
    }
  };
});
