angular.module('uibModalConfirm', []).controller('ConfirmModalController', function ($scope, $uibModalInstance, data) {
  $scope.data = angular.copy(data);

  $scope.ok = function () {
    $uibModalInstance.close();
  };

  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
}).value('$confirmModalDefaults', {
  template: '<div class="modal-header"><h3 class="modal-title">Confirm</h3></div><div class="modal-body">{{data.text}}</div><div class="modal-footer"><button class="btn btn-primary" ng-click="ok()">OK</button><button class="btn btn-warning" ng-click="cancel()">Cancel</button></div>',
  controller: 'ConfirmModalController'
}).factory('$confirm', function ($uibModal, $confirmModalDefaults) {
    return function (data, settings) {
      settings = angular.extend($confirmModalDefaults, (settings || {}));
      data = data || {};

      if ('templateUrl' in settings && 'template' in settings) {
        delete settings.template;
      }

      settings.resolve = {
        data: function () {
          return data;
        }
      };

      return $uibModal.open(settings).result;
    };
  })
  .directive('confirm', function ($confirm) {
    return {
      priority: 1,
      restrict: 'A',
      scope: {
        confirmIf: "=",
        ngClick: '&',
        confirm: '@'
      },
      link: function (scope, element, attrs) {
        console.log('link confirm', element, attrs);
        function reBind(func) {
          console.log('rebind', func, 'click');
          element.unbind("click").bind("click", function () {
            func();
          });
        }

        function bindConfirm() {
          $confirm({text: scope.confirm}).then(scope.ngClick);
        }

        if (angular.isDefined(attrs.confirmIf)) {
          scope.$watch('confirmIf', function (newVal) {
            if (newVal) {
              reBind(bindConfirm);
            } else {
              reBind(function () {
                scope.$apply(scope.ngClick);
              });
            }
          });
        } else {

          reBind(bindConfirm);
        }
      }
    }
  });
