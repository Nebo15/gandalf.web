"use strict";

angular.module('app').controller('SettingsProjectController', function ($scope, project, user, $uibModal) {
  $scope.project = project;
  $scope.user = user;

  $scope.export = function () {
    project.getExportURL().then(function (response) {
      window.location.href = response.data.url;
    });
  };

  $scope.resendMail = function () {
    user.resendActivateMail().then(function () {
      $uibModal.open({
        templateUrl: 'templates/modal/resend-activate-mail-success.html'
      });
    });
  }
});
