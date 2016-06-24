'use strict';

angular.module('app').directive('selectMatchingType', function () {
  return {
    restrict: 'E',
    //template: '<select name="matching_type" required="required" ng-model="matchingType" ng-change="onChangeMatchingType(matchingType)" class="form-control"> ' +
    //  '<option value="{{$root.APP.matchingTypes.all}}">Scoring Table - Return Total of all Passed Rules</option> ' +
    //  '<option value="{{$root.APP.matchingTypes.first}}">Decision Table - Return First Passed Rule</option> ' +
    //'</select>',
    template: '<div class="btn-group btn-group-matching">' +
      '<label class="btn btn-primary-matching" ng-model="matchingType" ng-change="onChangeMatchingType(matchingType)" uib-btn-radio="$root.APP.matchingTypes.all">Scoring</label> ' +
      '<label class="btn btn-primary-matching" ng-model="matchingType" ng-change="onChangeMatchingType(matchingType)" uib-btn-radio="$root.APP.matchingTypes.first">Decision</label>' +
    '</div>',
    scope: {
      model: '=ngModel',
      callback: '&'
    },
    link: function (scope) {

      scope.matchingType = scope.model;
    },
    controller: 'SelectMatchingTypeController'
  }
}).controller('SelectMatchingTypeController', function ($scope, $log, $uibModal) {

  var modalInstance = null;
  $scope.onChangeMatchingType = function (newType) {
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
    if ($scope.callback()) {
      $scope.callback()($scope.matchingType);
    }
    $scope.model = $scope.matchingType;
    modalInstance.close();
  }

});
