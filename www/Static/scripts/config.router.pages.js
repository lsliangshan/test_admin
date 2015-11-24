'use strict';

/**
 * @ngdoc function
 * @name app.config:uiRouter
 * @description
 * # Config
 * Config for the pages router
 */
angular.module('app')
  .config(
    [          '$stateProvider', '$urlRouterProvider',
      function ( $stateProvider,   $urlRouterProvider ) {
        $stateProvider
          .state('page', {
            url: '/page',
            views: {
              // So this one is targeting the unnamed view within the parent state's template.
              '': {
                templateUrl: '/Static/views/layout.html'
              },
              // This shows off how you could populate *any* view within *any* ancestor state.
              // Oopulating the ui-view="aside@"
              'aside': {
                templateUrl: '/Static/views/partials/aside.nav.pages.html'
              }
            }
          })
          .state('page.profile', {
            url: '/profile',
            templateUrl: '/Static/views/pages/profile.html'
          })
          .state('page.settings', {
            url: '/settings',
            templateUrl: '/Static/views/pages/settings.html'
          })
          .state('page.blank', {
            url: '/blank',
            templateUrl: '/Static/views/pages/blank.html'
          })
          .state('page.document', {
            url: '/document',
            templateUrl: '/Static/views/pages/document.html'
          })
          .state('signin', {
            url: '/signin',
            templateUrl: '/Static/views/pages/signin.html'
          })
          .state('signup', {
            url: '/signup',
            templateUrl: '/Static/views/pages/signup.html'
          })
          .state('forgot-password', {
            url: '/forgot-password',
            templateUrl: '/Static/views/pages/forgot-password.html'
          })
          .state('lockme', {
            url: '/lockme',
            templateUrl: '/Static/views/pages/lockme.html'
          })
          .state('404', {
            url: '/404',
            templateUrl: '/Static/views/pages/404.html'
          })
          .state('505', {
            url: '/505',
            templateUrl: '/Static/views/pages/505.html'
          })
      }
    ]
  );