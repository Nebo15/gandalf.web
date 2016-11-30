'use strict';

angular.module('app').controller('DebuggerDetailsController', function ($scope, table, $stateParams, $gandalf, ENV) {

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

  $scope.apiHost = ENV.api.endpoint;

  $scope.booleanVariants = [{
    title: 'true',
    value: true
  }, {
    title: 'false',
    value: false
  }, {
    title: 'null',
    value: null
  }];

  $scope.table = table;
  $scope.fields = angular.copy(unique(table.fields, 'key')).map(function (item) {
    item.value = item.value || null;
    return item;
  });

  $scope.response = {
    step1: "fill form",
    step2: "click on Send button"
  };

  if ($stateParams.decision) {
    $scope.fields.forEach(function (item) {
      item.value = $stateParams.decision.request[item.key];
    });
    $gandalf.consumer.check($stateParams.decision.id).then(function (resp) {
      $scope.response = resp.data;
    });
  }

  $scope.getRequestData = function (fields) {
    var res = angular.copy(fields);
    if (table.variants.length > 1) {
      res.push({
        key: 'variant_id',
        value: $stateParams.variantId
      });
    }

    return res;
  };

  $scope.loading = false;

  $scope.submit = function (form) {
    if (form.$invalid || $scope.loading) return;
    $scope.loading = true;

    var fields = arrayToObj($scope.fields, 'key', 'value');
    fields.variant_id = $stateParams.variantId;

    $gandalf.consumer.send(table.id, fields).catch(function (resp) {
      return resp;
    }).then(function (resp) {
      $scope.response = resp.data;
      $scope.loading = false;
    })
  };

});
