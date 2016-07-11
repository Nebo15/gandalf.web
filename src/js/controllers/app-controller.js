'use strict';

angular.module('app').controller('AppController', function ($scope, $state, ProjectsService, projects, user, $uibModal) {
  $scope.projects = projects;
  $scope.user = user;
  $scope.selectProject = ProjectsService.selectProject;
  $scope.project = ProjectsService.selectedProject();

  $scope.resendMail = function () {
    user.resendActivateMail().then(function () {
      $uibModal.open({
        templateUrl: 'templates/modal/resend-activate-mail-success.html'
      });
    });
  };

  $scope.$on('projectDidSelect', function (e, data) {
    //$state.go('tables-list');
    $scope.project = data;
  });
  $scope.$on('projectsDidUpdate', function (e, data) {
    $scope.projects = data;
  });

  $scope.$on('$stateChangeError', function (e, toState, toStateParams, fromState, fromStateParams, error) {
    e.preventDefault();

    if (error.status == 404) {
      $state.go('error', {
        code: 404,
        message: error.data.meta.error_message
      });
    }
  });
});
