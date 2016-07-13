'use strict';


angular.module('app').config(function(toastrConfig) {
  angular.extend(toastrConfig, {
    positionClass: 'toast-bottom-right',
    target: 'body'
  });
}).run(function (toastr, $rootScope) {

  $rootScope.$on('$gandalfError', function (e, error) {
    var errorMsg = Object.keys(error.data.data).map(function (item) {
      return error.data.data[item][0];
    });
    toastr.error(errorMsg[0], error.data.meta.error_message);
  });
});
