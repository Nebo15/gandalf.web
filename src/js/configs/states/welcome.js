angular.module('app').config(function ($stateProvider) {

  $stateProvider.state('welcome-data', {
    parent: 'auth',
    abstract: true,
    templateUrl: 'templates/welcome/layout.html',
    controller: 'WelcomeController'
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
});
