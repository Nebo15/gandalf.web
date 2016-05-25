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
  'delete_users',

  'edit_project',
  'delete_project'
]);


angular.module('app').constant('PROJECT_CONSUMER_SCOPES', [
  'read',
  'check'
]);
