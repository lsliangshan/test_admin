'use strict';

/**
 * @ngdoc function
 * @name app.config:uiRouter
 * @description
 * # Config
 * Config for the router
 */
angular.module('app')
  .run(
    [           '$rootScope', '$state', '$stateParams',
      function ( $rootScope,   $state,   $stateParams ) {
        $rootScope.$state = $state;
        $rootScope.$stateParams = $stateParams;
      }
    ]
  )
  .config(
    [          '$stateProvider', '$urlRouterProvider',
      function ( $stateProvider,   $urlRouterProvider ) {
        $urlRouterProvider
          .otherwise('#');
        $stateProvider
          .state('app', {
            abstract: true,
            url: '/app',
            views: {
              //'': {
              //  templateUrl: '/Static/views/layout.html'
              //}
              //,
              //'aside': {
              //  templateUrl: '/Static/views/partials/aside.nav.uikit.html'
              //}
            }
          })
            .state('app.dashboard', {
              url: '/dashboard',
              templateUrl: '/Static/views/pages/dashboard.html',
              resolve: {
                deps: ['$ocLazyLoad',
                  function( $ocLazyLoad ){
                    return $ocLazyLoad.load(['/Static/scripts/controllers/chart.js','/Static/scripts/controllers/vectormap.js']);
                }]
              }
            })
          .state('mail', {
            url: '/mail',
            views: {
              '': {
                templateUrl: '/Static/views/layout.html'
              },
              'aside': {
                templateUrl: '/Static/views/partials/aside.nav.mail.html'
              }
            }
          })
            .state('mail.inbox', {
              url: '/inbox',
              templateUrl: '/Static/views/pages/mail.html'
            })
      }
    ]
  );