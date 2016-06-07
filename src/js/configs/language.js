

angular.module('app').config(function($translateProvider) {
  $translateProvider.translations('en', {
    scopes: {
      users: {
        'create': 'Create',
        'read': 'View',
        'update': 'Update',
        'delete': 'Delete',
        'check': 'Create Decision via API',

        'create_consumers': 'Create',
        'update_consumers': 'Update',
        'delete_consumers': 'Delete',

        'update_users': 'Update Access',
        'add_user': 'Share Access',
        'delete_users': 'Remove Access',

        'edit_project': 'Change Settings',
        'delete_project': 'Delete'
      },
      users_details: {
        'create': 'Create tables',
        'read': 'View tables',
        'update': 'Update tables',
        'delete': 'Delete tables',
        'check': 'Create Decision via API',

        'create_consumers': 'Create API keys',
        'update_consumers': 'Update API keys',
        'delete_consumers': 'Delete API keys',

        'update_users': 'Update User Access',
        'add_user': 'Share User Access',
        'delete_users': 'Remove User Access',

        'edit_project': 'Change Project Settings',
        'delete_project': 'Delete Project'
      }
    },
    "warnings": {
      "rules": {
        "all_is_set": "⬆︎ This rule have all «is set» conditions, so it will be executed regardless request parameters."
      }
    }
  });
  $translateProvider.preferredLanguage('en');
});
