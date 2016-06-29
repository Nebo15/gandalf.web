angular.module('app').config(function ($stateProvider, $urlRouterProvider) {

  $stateProvider.state('main', {

    abstract: true,
    template: '<ui-view />',
    ncyBreadcrumb: {
      skip: true
    }
  });

  $stateProvider.state('private-load', {
    parent: 'auth',
    abstract: true,
    auth: true,
    template: '<ui-view />',
    ncyBreadcrumb: {
      skip: true
    },
    resolve: {
      user: ['UserService','projects', function (UserService,projects) {
        return UserService.current();
      }],
      projects: ['ProjectsService','$q', '$state', function (ProjectsService, $q, $state) {
        return $q.when(ProjectsService.all()).then(function (resp) {
          if (resp.length) return resp;
          $state.go('welcome-project-add');
        });
      }]
    },
    controller: 'AppController'
  });

  $stateProvider.state('private', {
    parent: 'private-load',
    abstract: true,
    auth: true,
    templateUrl: 'templates/layouts/private.html',
    ncyBreadcrumb: {
      skip: true
    }
  });
  $stateProvider.state('public', {
    parent: 'auth',
    abstract: true,
    auth: false,
    templateUrl: 'templates/layouts/public.html',
    ncyBreadcrumb: {
      skip: true
    }
  });

  $stateProvider.state('sign-in', {
    parent: 'public',
    url: '/sign-in?username',
    params: {
      errorCode: null,
      message: null
    },
    controller: 'SignInController',
    templateUrl: 'templates/sign-in.html',
    ncyBreadcrumb: {
      label: 'Sign in to Gandalf'
    }
  }).state('sign-up', {
    parent: 'public',
    url: '/sign-up?username?email',
    controller: 'SignUpController',
    templateUrl: 'templates/sign-up.html',
    ncyBreadcrumb: {
      label: 'Sign up to Gandalf'
    }
  }).state('reset-password', {
    parent: 'public',
    url: '/reset?email',
    controller: 'ResetPasswordController',
    templateUrl: 'templates/reset-password.html',
    ncyBreadcrumb: {
      label: 'Reset Password'
    }
  }).state('reset-password-confirm', {
    parent: 'public',
    url: '/reset/confirm?token',
    controller: 'ResetPasswordConfirmController',
    templateUrl: 'templates/reset-password-confirm.html',
    ncyBreadcrumb: {
      label: 'Set new password'
    }
  });


  $urlRouterProvider.otherwise('/tables');
});
