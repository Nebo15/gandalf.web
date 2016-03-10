'use strict';

angular.module('app').controller('DebuggerDetailsController', function ($scope, table) {

  function unique (collection, prop) {
    var props = [];
    return collection.filter(function (item) {
      if (props.indexOf(item[prop]) !== -1) return;
      props.push(item[prop]);
      return item;
    })
  }
  $scope.fields = angular.copy(unique(table.fields, 'alias'));
  $scope.submit = function (form) {
    if (form.$invalid) return;

  };

});
