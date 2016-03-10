'use strict';

angular.module('app').controller('DebuggerDetailsController', function ($scope, table, $stateParams, $gandalf, DecisionHistoryTable) {

  function unique (collection, prop) {
    var props = [];
    if (!prop) throw new Error('undefined prop');

    return collection.filter(function (item) {
      if (props.indexOf(item[prop]) !== -1) return;
      props.push(item[prop]);
      return item;
    })
  }
  function arrayToObj (array, propKey, valueKey) {
    var res = {};
    if (!propKey || !valueKey) throw new Error('undefined propKey and valueKey');

    array.forEach(function (item) {
      res[item[propKey]] = item[valueKey];
    });
    return res;
  }

  $scope.table = table;
  $scope.fields = angular.copy(unique(table.fields, 'alias'));

  $scope.response = {
    step1: "fill form",
    step2: "click on Send button"
  };

  if ($stateParams.decision) {
    $scope.fields.forEach(function (item) {
      item.value = $stateParams.decision.request[item.alias];
    });
    $gandalf.consumer.check($stateParams.decision.id).then(function (resp) {
      $scope.response = resp.data;
    });
  }

  $scope.loading = false;

  $scope.submit = function (form) {
    if (form.$invalid || $scope.loading) return;
    $scope.loading = true;
    $gandalf.consumer.send(table.id, arrayToObj($scope.fields, 'alias', 'value')).catch(function (resp) {
      return resp;
    }).then(function (resp) {
      $scope.response = resp.data;
      $scope.loading = false;
    })
  };

});
