

angular.module('app').config(function($translateProvider) {
  $translateProvider.translations('en', {
    scopes: {
      users: {
        'tables_create': {
          small: 'Create',
          details: 'Create tables'
        },
        'tables_view': {
          small: 'View',
          details: 'View tables'
        },
        'tables_update': {
          small: 'Update',
          details: 'Update tables'
        },
        'tables_delete': {
          small: 'Delete',
          details: 'Delete tables'
        },

        'consumers_get': {
          small: 'Read',
          details: 'View API keys'
        },
        'consumers_manage': {
          small: 'Manage',
          details: 'Update/Delete API keys'
        },

        'users_manage': {
          small: 'Manage',
          details: 'Update/Remove User Access'
        },

        'project_update': {
          small: 'Change Settings',
          details: 'Change Project Settings'
        },
        'project_delete': {
          small: 'Delete',
          details: 'Delete Project'
        },

        'decisions_view': {
          small: 'View',
          details: 'View Decisions History'
        },
        'decisions_make': {
          small: 'Make',
          details: 'Make API call for decision'
        }
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
        'invalid_password': 'Use minimum one upper, one lower charset and one number.',
        'password_minlength': 'Password should consist of more than 6 characters',
        'invalid_email': 'Invalid e-mail address'
      }
    },
    "warnings": {
      "rules": {
        "all_is_set": "⬆︎ This rule have all «is set» conditions, so it will be executed regardless request parameters."
      }
    },
    "error_codes": {
      401: "You don't have access to this feature."
    },
    "api_errors": {
      "reset_password": {
        "user_not_found": "User not found. Check email"
      }
    }
  });
  $translateProvider.preferredLanguage('en');
});
