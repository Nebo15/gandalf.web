

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

    validation: {
      errors: {
        'alphadashed_only': 'Decision can contain only alphanumerical characters, "_" and "-".',
        'number_only': 'Scoring can contain positive, negative numbers or zero.',
        'title_field_empty': 'Title field can not be empty',
        'key_field_empty': 'API key field can not be empty',
        'key_field_pattern': 'API key use only alphabet characters, dash and underscore',
        'decision_empty': 'Decision can not be empty',
        'table_name_empty': 'Name can not be empty',
        'table_description_empty': 'Description can not be empty',
        'new_project_title_empty': 'Project title can not be empty',
        'new_project_description_empty': 'Project description can not be empty',
        'row_title_charsets': 'Title must be between 2 and 128 characters',
        'row_description_charsets': 'Description must be between 2 and 128 characters',
        'invalid_username': 'Invalid username. Use only alphabet characters, dash, underscore and number.',
        'username_minlength': 'Login should consist of more than 2 characters',
        'invalid_password': 'Invalid password. Use minimum one upper and one lower charset.',
        'password_minlength': 'Password should consist of more than 6 characters'
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
