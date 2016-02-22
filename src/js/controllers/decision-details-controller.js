
angular.module('app').controller('DecisionDetailsController', function ($scope, $uibModal, decision, DecisionRule) {

  var table = decision;
  $scope.table = table;

  $scope.sortableOptions = {
    axis: 'y',
    handle: '> .decision-table__handler'
  };

  $scope.addNewField = function () {

    var modalInstance = $uibModal.open({
      templateUrl: 'templates/modal/add-field.html',
      controller: 'AddFieldController'
    });
    modalInstance.result.then(function (newField) {
      table.addField(newField);
    });

  };
  $scope.addNewRule = function () {

    var rule = DecisionRule.fromFields(table.fields, {
      priority: table.rules.length
    }); // can be different

    table.addRule(rule);
  };

  $scope.save = function () {
    table.save().then(function () {
      console.log('save success')
    }, function () {
      console.warn('save error')
    })
  }

});

angular.module('app').controller('DecisionCreateController', function ($scope, $controller, $state, DecisionTable) {

  $controller('DecisionDetailsController', {
    $scope: $scope,
    decision: new DecisionTable()
  }); //This works

  $scope.save = function () {
    console.log('create');
    $scope.table.create().then(function (resp) {
      $state.go('decision-details', {id: resp.id});
    }).catch(function (resp) {
      console.warn('error create', resp);
    })
  }

});
