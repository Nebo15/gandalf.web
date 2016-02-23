'use strict';


angular.module('app', [
  'conditions',

  'ng-gandalf',
  'ui.router',
  'ngStorage',
  'ui.bootstrap',
  'ui.sortable',
  'ncy-angular-breadcrumb'
]);

angular.module('app').constant('ENV', window.env);

