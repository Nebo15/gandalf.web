"use strict";

angular.module('app').constant('PROJECT_USER_SCOPES', [
  'tables_create',
  'tables_view',
  'tables_update',
  'tables_delete',
  'tables_query',

  'consumers_get',
  'consumers_manage',

  'users_manage',

  'project_update',
  'project_delete',

  'decisions_view'
]);


angular.module('app').constant('PROJECT_CONSUMER_SCOPES', [
  'decisions_view',
  'decisions_make'
]);
