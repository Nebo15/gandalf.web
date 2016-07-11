"use strict";

angular.module('app').controller('SettingsProjectController', function ($scope, project, user) {
  $scope.project = project;
  $scope.user = user;

  $scope.isExportLoading = false;
  $scope.exportDownload = false;

  $scope.export = function () {
    if ($scope.isExportLoading) {
      return;
    }

    $scope.isExportLoading = true;

    project.getExportURL().then(function (response) {
      $scope.isExportLoading = false;
      $scope.exportDownload = true;
      window.location.href = response.data.url;
    });
  };
});
