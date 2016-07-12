angular.module('app').config(function ($stateProvider, $urlRouterProvider) {

  $stateProvider.state('main', {
    abstract: true,
    template: '<ui-view />'
  });

  $stateProvider.state('private-load', {
    parent: 'auth',
    abstract: true,
    auth: true,
    template: '<ui-view />',
    resolve: {
      user: ['UserService', function (UserService) {
        return UserService.current();
      }],
      projects: ['ProjectsService','$q', '$state', 'user', function (ProjectsService, $q, $state) {
        return $q.when(ProjectsService.all()).then(function (resp) {
          if (resp.length) {
            return resp;
          }
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
    templateUrl: 'templates/layouts/private.html'
  });

  $stateProvider.state('public', {
    parent: 'auth',
    abstract: true,
    auth: false,
    templateUrl: 'templates/layouts/public.html'
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
    resolve: {
      isAuth: ['AuthService', '$state', function (AuthService, $state) {
        return AuthService.checkAuth().then(function () {
          $state.go('tables-list');
        }).catch(function () {
          return null;
        });
      }]
    }
  }).state('sign-up', {
    parent: 'public',
    url: '/sign-up?username?email?invite',
    controller: 'SignUpController',
    templateUrl: 'templates/sign-up.html',
    resolve: {
      isAuth: ['AuthService', '$state', function (AuthService, $state) {
        return AuthService.checkAuth().then(function () {
          $state.go('tables-list');
        }).catch(function () {
          return null;
        });
      }]
    }
  }).state('activate', {
    parent: 'public',
    url: '/activate/:token',
    controller: 'ActivateController',
    templateUrl: 'templates/activate.html',
    resolve: {
      user: ['UserService', 'AuthService', '$state', '$stateParams', function (UserService, AuthService, $state, $stateParams) {
        return UserService.verifyEmail($stateParams.token).then(function (response) {
          return response.data;
        }).then(null, function () {
          return null;
        });
      }]
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

  $stateProvider.state('error', {
    parent: 'private',
    url: '/error/:code',
    params: {
      code: '404',
      message: 'Page not found'
    },
    templateUrl: 'templates/error.html',
    controller: function ($scope, $stateParams) {
      $scope.code = $stateParams.code;
      $scope.message = $stateParams.message;
    }
  });

  $urlRouterProvider.otherwise('/tables');
});
