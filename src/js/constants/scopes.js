"use strict";

angular.module('app').constant('PROJECT_USER_SCOPES', [
  'create',
  'read',
  'update',
  'delete',
  'check'
]);

angular.module('app').constant('PROJECT_CONSUMER_SCOPES', [
  'read',
  'check'
]);
