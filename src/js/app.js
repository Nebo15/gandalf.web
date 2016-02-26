'use strict';


angular.module('app', [
  'conditions',
  'ng-equal',

  'ng-gandalf',
  'ui.router',
  'ngStorage',
  'ui.bootstrap',
  'ui.sortable',
  'ncy-angular-breadcrumb'
]);

angular.module('app').constant('ENV', window.env);


angular.module('app').filter('string', function () {
  return function (str) {
    return str == null ? 'null' : str.toString();
  };
});
