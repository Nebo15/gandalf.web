"use strict";

angular.module('app').controller('consumerAddController', function ($scope, $uibModalInstance, project, PROJECT_CONSUMER_SCOPES, ProjectConsumer, User, $q) {

  $scope.project = project;
  $scope.model = new ProjectConsumer();
  $scope.scopes = PROJECT_CONSUMER_SCOPES;

  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
  $scope.save = function (form) {
    if (form.$invalid) return;
    $scope.project.addConsumer($scope.model).then(function () {
      $uibModalInstance.dismiss('cancel');
    });
  };
});

angular.module('app').directive('consumerAdd', function ($uibModal) {
  return {
    restrict: 'EA',
    scope: {
      project: '=consumerAdd'
    },
    link: function (scope, el, attrs) {
      el.bind('click', function () {
        $uibModal.open({
          templateUrl: 'templates/modal/consumer-add.html',
          controller: 'consumerAddController',
          resolve: {
            project: function () {
              return scope.project;
            }
          }
        });
      })
    }
  };
});
