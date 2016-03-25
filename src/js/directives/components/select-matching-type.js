'use strict';

angular.module('app').directive('selectMatchingType', function () {
  return {
    restrict: 'E',
    template: '<select name="matching_type" required="required" ng-model="matchingType" ng-change="onChangeMatchingType(matchingType)" class="form-control"> ' +
      '<option value="{{$root.APP.matchingTypes.all}}">All</option> ' +
      '<option value="{{$root.APP.matchingTypes.first}}">First</option> ' +
    '</select>',
    scope: {
      model: '=ngModel',
      callback: '&'
    },
    link: function (scope) {
      scope.matchingType = scope.model;
      console.log(scope.callback);
    },
    controller: 'SelectMatchingTypeController'
  }
}).controller('SelectMatchingTypeController', function ($scope, $log, $uibModal) {

  var modalInstance = null;
  $scope.onChangeMatchingType = function (newType) {
    $log.debug('new type', newType);
    modalInstance = $uibModal.open({
      templateUrl: 'templates/modal/change-matching-type.html',
      scope: $scope
    });

  };
  $scope.cancel = function () {
    $scope.matchingType = $scope.model;
    modalInstance.close();
  };
  $scope.confirm = function () {
    $scope.callback()($scope.matchingType);
    $scope.model = $scope.matchingType;
    modalInstance.close();
  }

});
