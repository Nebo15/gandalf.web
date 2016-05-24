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
      user: ['UserService', function (UserService) {
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
  });




  $stateProvider.state('history-list', {
    parent: 'private',
    url: '/history?tableId?size?page',
    params: {
      size: '25'
    },
    controller: 'HistoryListController',
    templateUrl: 'templates/history-list.html',
    ncyBreadcrumb: {
      label: 'History'
    },
    resolve: {
      selectedTable: ['DecisionTable', '$stateParams', function (DecisionTable, $stateParams) {
        return $stateParams.tableId ? DecisionTable.byId($stateParams.tableId) : null;
      }]
    }
  }).state('history-details', {
    parent: 'private',
    url: '/history/:id',
    controller: 'HistoryDetailsController',
    templateUrl: 'templates/history-details.html',
    ncyBreadcrumb: {
      label: 'Decision: {{table.id}}',
      parent: 'history-list'
    },
    resolve: {
      historyResult: ['DecisionHistoryTable', '$stateParams', function (DecisionHistoryTable, $stateParams) {
        var res = new DecisionHistoryTable($stateParams.id);
        return res.fetch();
      }]
    }
  });

  $urlRouterProvider.otherwise('/tables');
});
