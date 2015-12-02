'use strict';

/**
 * @ngdoc overview
 * @name app
 * @description
 * # app
 *
 * Main module of the application.
 */
angular
  .module('app', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'ngTouch',
    'ngStorage',
    'ui.router',
    'ui.utils',
    'mgcrea.ngStrap',
    'pascalprecht.translate',
    'oc.lazyLoad',
    'ui.load',
    'ui.jp',
    'angular-loading-bar',
      'angularFileUpload',
      "chieffancypants.loadingBar"
  ])
    
.config(function (cfpLoadingBarProvider) {
    cfpLoadingBarProvider.includeSpinner = true;
})
;

angular.element(window).bind('load', function () {
    var onloadedTimeout = setTimeout(function () {
        //hideLoading(true);
        hideBack();
        clearTimeout(onloadedTimeout);
    }, 600);
});