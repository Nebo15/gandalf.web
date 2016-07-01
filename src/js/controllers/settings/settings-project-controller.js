"use strict";

angular.module('app').controller('SettingsProjectController', function ($scope, project) {
  $scope.project = project;

  $scope.export = function () {
    project.getExportURL().then(function (response) {
      window.location.href = response.data.url;
    });
  }
});
