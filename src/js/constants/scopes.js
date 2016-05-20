"use strict";

angular.module('app').constant('PROJECT_USER_SCOPES', [
  'create',
  'read',
  'update',
  'delete',
  'check',
  'create_consumers',
  'delete_consumers',
  'update_users',
  'add_user',
  'edit_project',
  'delete_project',
  'delete_consumers',
  'delete_users'
]);

angular.module('app').constant('PROJECT_CONSUMER_SCOPES', [
  'read',
  'check'
]);
