

angular.module('app').service('utils', function ($state, $stateParams) {

  this.reload = function () {
    console.log('reload');
    $state.transitionTo($state.$current, $stateParams, {
      reload: true,
      inherit: false,
      notify: true
    });
  };

});
