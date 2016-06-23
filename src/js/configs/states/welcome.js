angular.module('app').config(function ($stateProvider) {

  $stateProvider.state('welcome-data', {
    parent: 'auth',
    abstract: true,
    template: '<ui-view />',
    controller: 'WelcomeController'
    //resolve: {
      //user: ['UserService', function (UserService) {
      //  return UserService.current();
      //}]
    //}
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
    parent: 'welcome-layout',
    url: '/welcome/project/create',
    templateUrl: 'templates/welcome/project-add.html',
    controller: 'WelcomeProjectAddController'
  });
});
