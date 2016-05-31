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
      $uibModalInstance.close($scope.project.consumers[$scope.project.consumers.length - 1]);
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
        var modal = $uibModal.open({
          templateUrl: 'templates/modal/consumer-add.html',
          controller: 'consumerAddController',
          resolve: {
            project: function () {
              return scope.project;
            }
          }
        });

        modal.result.then(function (model) {
          $uibModal.open({
            templateUrl: 'templates/modal/consumer-info.html',
            controller: 'consumerEditController',
            resolve: {
              consumer: function () {
                return model;
              },
              project: function () {
                return scope.project;
              }
            }
          })
        })
      })
    }
  };
});
