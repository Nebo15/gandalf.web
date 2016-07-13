'use strict';


angular.module('app').config(function(toastrConfig) {
  angular.extend(toastrConfig, {
    positionClass: 'toast-bottom-right',
    target: 'body'
  });
}).run(function (toastr, $rootScope, lodash) {

  $rootScope.$on('$gandalfError', function (e, error) {
    if (!error.data) return;
    if (error.data.data) {
      var errorMsg = Object.keys(error.data.data).map(function (item) {
        return error.data.data[item][0];
      });
      return toastr.error(errorMsg[0], error.data.meta.error_message);
    }
    if (error.data.error) {
      return toastr.error(error.data.error_message, error.data.error);
    }
    if (error.data.meta) {
      return toastr.error(error.data.meta.error_message);
    }
  });
});
