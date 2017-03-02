angular.module('app').config(function ($stateProvider) {

  $stateProvider.state('welcome-data', {
    parent: 'auth',
    auth: true,
    abstract: true,
    templateUrl: 'templates/welcome/layout.html',
    controller: 'WelcomeController',
    resolve: {
      user: ['UserService', function (UserService) {
        return UserService.current();
      }]
    }
  });

  $stateProvider.state('welcome-layout', {
    parent: 'welcome-data',
    templateUrl: 'templates/welcome/layout.html'
  });

  $stateProvider.state('welcome-index', {
    parent: 'welcome-data',
    url: '/welcome',
    templateUrl: 'templates/welcome/index.html'
  });

  $stateProvider.state('welcome-project-add', {
    parent: 'welcome-data',
    url: '/welcome/project/create',
    templateUrl: 'templates/welcome/project-add.html',
    controller: 'WelcomeProjectAddController'
  });

  $stateProvider.state('welcome-activate', {
    parent: 'welcome-data',
    url: '/welcome/activate',
    templateUrl: 'templates/welcome/send-email.html'
  });
});
