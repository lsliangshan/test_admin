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
// config

var app =
        angular.module('app')
            .config(
                ['$controllerProvider', '$compileProvider', '$filterProvider', '$provide',
                    function ($controllerProvider, $compileProvider, $filterProvider, $provide) {

                        // lazy controller, directive and service
                        app.controller = $controllerProvider.register;
                        app.directive = $compileProvider.directive;
                        app.filter = $filterProvider.register;
                        app.factory = $provide.factory;
                        app.service = $provide.service;
                        app.constant = $provide.constant;
                        app.value = $provide.value;
                    }
                ])
            .config(['$translateProvider', function ($translateProvider) {
                // Register a loader for the static files
                // So, the module will search missing translation tables under the specified urls.
                // Those urls are [prefix][langKey][suffix].
                $translateProvider.useStaticFilesLoader({
                    prefix: '/Static/i18n/',
                    suffix: '.js'
                });
                // Tell the module what language to use by default
                $translateProvider.preferredLanguage('en');
                // Tell the module to store the language in the local storage
                $translateProvider.useLocalStorage();
            }])

            .config(["$datepickerProvider", function ($datepickerProvider) {
                angular.extend($datepickerProvider.defaults, {
                    dateFormat: 'yyyy-MM-dd',
                    startWeek: 1,
                    autoclose: true,
                    dateType: "iso"
                });
            }])

            .config(["$timepickerProvider", function ($timepickerProvider) {
                angular.extend($timepickerProvider.defaults, {
                    timeFormat: "HH:mm",
                    autoclose: true,
                    length: 7
                });
            }])

            .config(["$dropdownProvider", function ($dropdownProvider) {
                angular.extend($dropdownProvider.defaults, {
                    animation: "am-flip-x"
                });
            }])

            .config(["$asideProvider", function ($asideProvider) {
                angular.extend($asideProvider.defaults, {
                    animation: "am-fade-and-slide-bottom",
                    placement: "bottom",
                    container: "body",
                    title: "提示"
                    //,
                    //backdrop: 'static'
                });
            }])

            .config(["$modalProvider", function ($modalProvider) {
                angular.extend($modalProvider.defaults, {
                    animation: "am-fade-and-scale",
                    backdropAnimation: "am-fade",
                    title: "提示",
                    container: "body"
                });
            }])

            .config(["$tooltipProvider", function ($tooltipProvider) {
                angular.extend($tooltipProvider, {
                    animation: "am-fade",
                    trigger: "hover",
                    container: "body"
                })
            }])
    ;
'use strict';

/**
 * 0.1.1
 * Deferred load js/css file, used for ui-jq.js and Lazy Loading.
 * 
 * @ flatfull.com All Rights Reserved.
 * Author url: http://themeforest.net/user/flatfull
 */

angular.module('ui.load', [])
	.service('uiLoad', ['$document', '$q', '$timeout', function ($document, $q, $timeout) {

		var loaded = [];
		var promise = false;
		var deferred = $q.defer();

		/**
		 * Chain loads the given sources
		 * @param srcs array, script or css
		 * @returns {*} Promise that will be resolved once the sources has been loaded.
		 */
		this.load = function (srcs) {
			srcs = angular.isArray(srcs) ? srcs : srcs.split(/\s+/);
			var self = this;
			if(!promise){
				promise = deferred.promise;
			}
      angular.forEach(srcs, function(src) {
      	promise = promise.then( function(){
      		return src.indexOf('.css') >=0 ? self.loadCSS(src) : self.loadScript(src);
      	} );
      });
      deferred.resolve();
      return promise;
		}

		/**
		 * Dynamically loads the given script
		 * @param src The url of the script to load dynamically
		 * @returns {*} Promise that will be resolved once the script has been loaded.
		 */
		this.loadScript = function (src) {
			if(loaded[src]) return loaded[src].promise;

			var deferred = $q.defer();
			var script = $document[0].createElement('script');
			script.src = src;
			script.onload = function (e) {
				$timeout(function () {
					deferred.resolve(e);
				});
			};
			script.onerror = function (e) {
				$timeout(function () {
					deferred.reject(e);
				});
			};
			$document[0].body.appendChild(script);
			loaded[src] = deferred;

			return deferred.promise;
		};

		/**
		 * Dynamically loads the given CSS file
		 * @param href The url of the CSS to load dynamically
		 * @returns {*} Promise that will be resolved once the CSS file has been loaded.
		 */
		this.loadCSS = function (href) {
			if(loaded[href]) return loaded[href].promise;

			var deferred = $q.defer();
			var style = $document[0].createElement('link');
			style.rel = 'stylesheet';
			style.type = 'text/css';
			style.href = href;
			style.onload = function (e) {
				$timeout(function () {
					deferred.resolve(e);
				});
			};
			style.onerror = function (e) {
				$timeout(function () {
					deferred.reject(e);
				});
			};
			$document[0].head.appendChild(style);
			loaded[href] = deferred;

			return deferred.promise;
		};
}]);
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
'use strict';

/**
 * @ngdoc function
 * @name app.config:uiRouter
 * @description
 * # Config
 * Config for the uikit router
 */
angular.module('app')
  .config(
    [          '$stateProvider', '$urlRouterProvider',
      function ( $stateProvider,   $urlRouterProvider ) {
        $stateProvider
          .state('ui', {
            url: '/ui',
            views: {
              // This shows off how you could populate *any* view within *any* ancestor state.
              // Oopulating the ui-view="aside@"
              //'aside': {
              //  templateUrl: '/Static/views/partials/aside.nav.uikit.html'
              //},
              // So this one is targeting the unnamed view within the parent state's template.
              //'': {
              //  templateUrl: '/Static/views/layout.html'
              //}
            }
          })
            // components router
            .state('ui.component', {
              url: '/component',
              template: '<div ui-view></div>'
            })
              .state('ui.component.arrow', {
                url: '/arrow',
                templateUrl: '/Static/views/ui/component/arrow.html'
              })
              .state('ui.component.badge-label', {
                url: '/badge-label',
                templateUrl: '/Static/views/ui/component/badge-label.html'
              })
              .state('ui.component.button', {
                url: '/button',
                templateUrl: '/Static/views/ui/component/button.html'
              })
              .state('ui.component.color', {
                url: '/color',
                templateUrl: '/Static/views/ui/component/color.html'
              })
              .state('ui.component.grid', {
                url: '/grid',
                templateUrl: '/Static/views/ui/component/grid.html'
              })
              .state('ui.component.icon', {
                url: '/icons',
                templateUrl: '/Static/views/ui/component/icon.html'
              })
              .state('ui.component.list', {
                url: '/list',
                templateUrl: '/Static/views/ui/component/list.html'
              })
              .state('ui.component.nav', {
                url: '/nav',
                templateUrl: '/Static/views/ui/component/nav.html'
              })
              .state('ui.component.panel', {
                url: '/panel',
                templateUrl: '/Static/views/ui/component/panel.html'
              })
              .state('ui.component.progressbar', {
                url: '/progressbar',
                templateUrl: '/Static/views/ui/component/progressbar.html'
              })
              .state('ui.component.streamline', {
                url: '/streamline',
                templateUrl: '/Static/views/ui/component/streamline.html'
              })
              .state('ui.component.timeline', {
                url: '/timeline',
                templateUrl: '/Static/views/ui/component/timeline.html'
              })
            // angular-strap routers
            .state('ui.angular-strap', {
              url: '/angular-strap',
              template: '<div ui-view class="fade-in"></div>',
              resolve: {
                deps: ['$ocLazyLoad',
                  function( $ocLazyLoad ){
                    return $ocLazyLoad.load(['/Static/scripts/controllers/angular-strap.js']);
                }]
              }
            })
              .state('ui.angular-strap.affix', {
                url: '/affix',
                templateUrl: '/Static/views/ui/angular-strap/affix.html'
              })
              .state('ui.angular-strap.alert', {
                url: '/alert',
                templateUrl: '/Static/views/ui/angular-strap/alert.html'
              })
              .state('ui.angular-strap.aside', {
                url: '/aside',
                templateUrl: '/Static/views/ui/angular-strap/aside.html'
              })
              .state('ui.angular-strap.button', {
                url: '/button',
                templateUrl: '/Static/views/ui/angular-strap/button.html'
              })
              .state('ui.angular-strap.collapse', {
                url: '/collapse',
                templateUrl: '/Static/views/ui/angular-strap/collapse.html'
              })
              .state('ui.angular-strap.dropdown', {
                url: '/dropdown',
                templateUrl: '/Static/views/ui/angular-strap/dropdown.html'
              })
              .state('ui.angular-strap.datepicker', {
                url: '/datepicker',
                templateUrl: '/Static/views/ui/angular-strap/datepicker.html'
              })
              .state('ui.angular-strap.timepicker', {
                url: '/timepicker',
                templateUrl: '/Static/views/ui/angular-strap/timepicker.html'
              })
              .state('ui.angular-strap.modal', {
                url: '/modal',
                templateUrl: '/Static/views/ui/angular-strap/modal.html'
              })
              .state('ui.angular-strap.select', {
                url: '/select',
                templateUrl: '/Static/views/ui/angular-strap/select.html'
              })
              .state('ui.angular-strap.tab', {
                url: '/tab',
                templateUrl: '/Static/views/ui/angular-strap/tab.html'
              })
              .state('ui.angular-strap.tooltip', {
                url: '/tooltip',
                templateUrl: '/Static/views/ui/angular-strap/tooltip.html'
              })
              .state('ui.angular-strap.popover', {
                url: '/popover',
                templateUrl: '/Static/views/ui/angular-strap/popover.html'
              })
              .state('ui.angular-strap.typeahead', {
                url: '/typehead',
                templateUrl: '/Static/views/ui/angular-strap/typeahead.html'
              })
            // form routers
            .state('ui.form', {
              url: '/form',
              template: '<div ui-view></div>'
            })
              .state('ui.form.layout', {
                url: '/layout',
                templateUrl: '/Static/views/ui/form/layout.html'
              })
              .state('ui.form.element', {
                url: '/element',
                templateUrl: '/Static/views/ui/form/element.html'
              })              
              .state('ui.form.validation', {
                url: '/validation',
                templateUrl: '/Static/views/ui/form/validation.html'
              })
              .state('ui.form.select', {
                url: '/select',
                templateUrl: '/Static/views/ui/form/select.html',
                controller: 'SelectCtrl',
                resolve: {
                    deps: ['$ocLazyLoad',
                      function( $ocLazyLoad ){
                        return $ocLazyLoad.load('/Static/scripts/controllers/select.js');
                    }]
                }
              })
              .state('ui.form.editor', {
                url: '/editor',
                templateUrl: '/Static/views/ui/form/editor.html',
                controller: 'EditorCtrl',
                resolve: {
                    deps: ['$ocLazyLoad',
                      function( $ocLazyLoad ){
                        return $ocLazyLoad.load('/Static/scripts/controllers/editor.js');
                    }]
                }
              })
              .state('ui.form.slider', {
                url: '/slider',
                templateUrl: '/Static/views/ui/form/slider.html',
                controller: 'SliderCtrl',
                resolve: {
                    deps: ['$ocLazyLoad',
                      function( $ocLazyLoad ){
                        return $ocLazyLoad.load('/Static/scripts/controllers/slider.js');
                    }]
                }
              })
              .state('ui.form.tree', {
                url: '/tree',
                templateUrl: '/Static/views/ui/form/tree.html',
                controller: 'TreeCtrl',
                resolve: {
                    deps: ['$ocLazyLoad',
                      function( $ocLazyLoad ){
                        return $ocLazyLoad.load('/Static/scripts/controllers/tree.js');
                    }]
                }
              })
              .state('ui.form.file-upload', {
                url: '/file-upload',
                templateUrl: '/Static/views/ui/form/file-upload.html',
                controller: 'UploadCtrl',
                resolve: {
                    deps: ['$ocLazyLoad',
                      function( $ocLazyLoad ){
                        return $ocLazyLoad.load('angularFileUpload').then(
                          function(){
                             return $ocLazyLoad.load('/Static/scripts/controllers/upload.js');
                          }
                        )
                    }]
                }
              })
              .state('ui.form.image-crop', {
                url: '/image-crop',
                templateUrl: '/Static/views/ui/form/image-crop.html',
                controller: 'ImgCropCtrl',
                resolve: {
                    deps: ['$ocLazyLoad',
                      function( $ocLazyLoad ){
                        return $ocLazyLoad.load('ngImgCrop').then(
                          function(){
                             return $ocLazyLoad.load('/Static/scripts/controllers/imgcrop.js');
                          }
                        )
                    }]
                }
              })
            // table routers
            .state('ui.table', {
              url: '/table',
              template: '<div ui-view></div>'
            })
              .state('ui.table.static', {
                url: '/static',
                templateUrl: '/Static/views/ui/table/static.html'
              })
              .state('ui.table.smart', {
                url: '/smart',
                templateUrl: '/Static/views/ui/table/smart.html',
                controller: 'TableCtrl',
                resolve: {
                    deps: ['$ocLazyLoad',
                      function( $ocLazyLoad ){
                        return $ocLazyLoad.load('smart-table').then(
                          function(){
                             return $ocLazyLoad.load('/Static/scripts/controllers/table.js');
                          }
                        )
                    }]
                }
              })
            // chart
            .state('ui.chart', {
              url: '/chart',
              templateUrl: '/Static/views/ui/chart/chart.html',
              resolve: {
                  deps: ['$ocLazyLoad',
                    function( $ocLazyLoad ){
                      return $ocLazyLoad.load('/Static/scripts/controllers/chart.js');
                  }]
              }
            })
            // map routers
            .state('ui.map', {
              url: '/map',
              template: '<div ui-view></div>'
            })
              .state('ui.map.google', {
                url: '/google',
                templateUrl: '/Static/views/ui/map/google.html',
                controller: 'GoogleMapCtrl',
                resolve: {
                    deps: ['$ocLazyLoad',
                      function( $ocLazyLoad ){
                        return $ocLazyLoad.load( ['ui.map',
                            {
                              files: ['/Static/scripts/controllers/load-google-maps.js',
                                      '/Static/scripts/controllers/googlemap.js']
                            }
                          ]).then(
                          function(){
                            return loadGoogleMaps(); 
                          }
                        )
                    }]
                }
              })
              .state('ui.map.vector', {
                url: '/vector',
                templateUrl: '/Static/views/ui/map/vector.html',
                controller: 'VectorMapCtrl',
                resolve: {
                    deps: ['$ocLazyLoad',
                      function( $ocLazyLoad ){
                        return $ocLazyLoad.load('/Static/scripts/controllers/vectormap.js');
                    }]
                }
              })
      }
    ]
  );

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
// lazyload config

angular.module('app')
  .constant('MODULE_CONFIG', [
      {
          name: 'ui.select',
          module: true,
          files: [
              '/Static/bower_components/angular-ui-select/dist/select.min.js',
              '/Static/bower_components/angular-ui-select/dist/select.min.css'
          ]
      },
      {
          name: 'textAngular',
          module: true,
          files: [
              '/Static/bower_components/textAngular/dist/textAngular-sanitize.min.js',
              '/Static/bower_components/textAngular/dist/textAngular.min.js'
          ]
      },
      {
          name: 'vr.directives.slider',
          module: true,
          files: [
              '/Static/bower_components/venturocket-angular-slider/build/angular-slider.min.js',
              '/Static/bower_components/venturocket-angular-slider/build/angular-slider.css'
          ]
      },
      {
          name: 'angularBootstrapNavTree',
          module: true,
          files: [
              '/Static/bower_components/angular-bootstrap-nav-tree/dist/abn_tree_directive.js',
              '/Static/bower_components/angular-bootstrap-nav-tree/dist/abn_tree.css'
          ]
      },
      {
          name: 'angularFileUpload',
          module: true,
          files: [
              '/Static/bower_components/angular-file-upload/angular-file-upload.js'
          ]
      },
      {
          name: 'ngImgCrop',
          module: true,
          files: [
              '/Static/bower_components/ngImgCrop/compile/minified/ng-img-crop.js',
              '/Static/bower_components/ngImgCrop/compile/minified/ng-img-crop.css'
          ]
      },
      {
          name: 'smart-table',
          module: true,
          files: [
              '/Static/bower_components/angular-smart-table/dist/smart-table.min.js'
          ]
      },
      {
          name: 'ui.map',
          module: true,
          files: [
              '/Static/bower_components/angular-ui-map/ui-map.js'
          ]
      },
      {
          name: 'easyPieChart',
          module: false,
          files: [
              '/Static/bower_components/jquery.easy-pie-chart/dist/jquery.easypiechart.fill.js'
          ]
      },
      {
          name: 'sparkline',
          module: false,
          files: [
              '/Static/bower_components/jquery.sparkline/dist/jquery.sparkline.retina.js'
          ]
      },
      {
          name: 'plot',
          module: false,
          files: [
              '/Static/bower_components/flot/jquery.flot.js',
              '/Static/bower_components/flot/jquery.flot.resize.js',
              '/Static/bower_components/flot/jquery.flot.pie.js',
              '/Static/bower_components/flot.tooltip/js/jquery.flot.tooltip.min.js',
              '/Static/bower_components/flot-spline/js/jquery.flot.spline.min.js',
              '/Static/bower_components/flot.orderbars/js/jquery.flot.orderBars.js'
          ]
      },
      {
          name: 'vectorMap',
          module: false,
          files: [
              '/Static/bower_components/bower-jvectormap/jquery-jvectormap-1.2.2.min.js',
              '/Static/bower_components/bower-jvectormap/jquery-jvectormap-1.2.2.css', 
              '/Static/bower_components/bower-jvectormap/jquery-jvectormap-world-mill-en.js',
              '/Static/bower_components/bower-jvectormap/jquery-jvectormap-us-aea-en.js'
          ]
      },
      {
          name: "loadStyleCss",
          module: false,
          files: [
              "/Static/styles/style.css"
          ]
      },
      {
          name: "loadAjaxForm",
          module: false,
          files: [
              "/Static/scripts/jquery.ajaxform.js"
          ]
      },
      {
          name: "jDatetime",
          module: false,
          files: [
              //"/Static/bower_components/angular/angular.js",
              //"/Static/bower_components/bootstrap/dist/js/bootstrap.min.js",
              "/Static/bower_components/date-time/bootstrap-datetimepicker.min.css",
              "/Static/bower_components/date-time/bootstrap-datetimepicker.min.js",
              "/Static/bower_components/date-time/locales/bootstrap-datetimepicker.zh-CN.js"
          ]
      },
      {
          name: "jColorpicker",
          module: false,
          files: [
              //"/Static/bower_components/angular/angular.js",
              "/Static/bower_components/bootstrap/dist/js/bootstrap.min.js",
              "/Static/bower_components/bootstrap-colorpicker/bootstrap.colorpickersliders.min.css",
              "/Static/bower_components/bootstrap-colorpicker/tinycolor.min.js",
              "/Static/bower_components/bootstrap-colorpicker/bootstrap.colorpickersliders.min.js"
          ]
      },
      {
          name: "jSelect2",
          module: false,
          files: [
              "/Static/bower_components/select2/dist/css/select2.min.css",
              "/Static/bower_components/select2/dist/js/select2.full.js"
              //,
              //"/Static/bower_components/select2/dist/js/i18n/zh-CN.js"
          ]
      }
    ]
  )
  .config(['$ocLazyLoadProvider', 'MODULE_CONFIG', function($ocLazyLoadProvider, MODULE_CONFIG) {
      $ocLazyLoadProvider.config({
          debug: false,
          events: false,
          modules: MODULE_CONFIG
      });
  }]);

'use strict';

/**
 * @ngdoc function
 * @name app.directive:uiNav
 * @description
 * # uiScroll
 * Directive of the app
 */
angular.module('app')
  .directive('lazyLoad', ['MODULE_CONFIG','$ocLazyLoad', '$compile', function(MODULE_CONFIG, $ocLazyLoad, $compile) {
    return {
      restrict: 'A',
      compile: function (el, attrs) {
        var contents = el.contents().remove(), name;
        return function(scope, el, attrs){
          angular.forEach(MODULE_CONFIG, function(module) {
            if( module.name == attrs.lazyLoad){
              if(!module.module){
                name = module.files;
              }else{
                name = module.name;
              }
            }
          });
          $ocLazyLoad.load(name)
          .then(function(){
            $compile(contents)(scope, function(clonedElement, scope) {
              el.append(clonedElement);
            });
          });
        }
      }
    };
  }])
'use strict';

angular.module('ui.jp', ['oc.lazyLoad', 'ui.load']).
  value('uiJpConfig', {}).
  directive('uiJp', ['uiJpConfig', 'MODULE_CONFIG', '$ocLazyLoad', 'uiLoad', '$timeout', function uiJpInjectingFunction(uiJpConfig, MODULE_CONFIG, $ocLazyLoad, uiLoad, $timeout) {

  return {
    restrict: 'A',
    compile: function uiJpCompilingFunction(tElm, tAttrs) {

      var options = uiJpConfig && uiJpConfig[tAttrs.uiJp];

      return function uiJpLinkingFunction(scope, elm, attrs) {

        function getOptions(){
          var linkOptions = [];

          // If ui-options are passed, merge (or override) them onto global defaults and pass to the jQuery method
          if (attrs.uiOptions) {
            linkOptions = scope.$eval('[' + attrs.uiOptions + ']');
            if (angular.isObject(options) && angular.isObject(linkOptions[0])) {
              linkOptions[0] = angular.extend({}, options, linkOptions[0]);
            }
          } else if (options) {
            linkOptions = [options];
          }
          return linkOptions;
        }

        // If change compatibility is enabled, the form input's "change" event will trigger an "input" event
        if (attrs.ngModel && elm.is('select,input,textarea')) {
          elm.bind('change', function() {
            elm.trigger('input');
          });
        }

        // Call jQuery method and pass relevant options
        function callPlugin() {
          $timeout(function() {
            elm[attrs.uiJp] && elm[attrs.uiJp].apply(elm, getOptions());
          }, 0, false);
        }

        function refresh(){
          // If ui-refresh is used, re-fire the the method upon every change
          if (attrs.uiRefresh) {
            scope.$watch(attrs.uiRefresh, function() {
              callPlugin();
            });
          }
        }

        var jp = false;
        angular.forEach(MODULE_CONFIG, function(module) {
          if( module.name == attrs.uiJp){
            jp = module.files;
          }
        });

        if ( jp ) {
          // $ocLazyLoad.load(jp)
          uiLoad.load(jp).then(function() {
            callPlugin();
            refresh();
          }).catch(function() {
            
          });
        } else {
          callPlugin();
          refresh();
        }
      };
    }
  };
}]);
'use strict';

/**
 * @ngdoc function
 * @name app.directive:uiNav
 * @description
 * # uiScroll
 * Directive of the app
 */
angular.module('app')
    .directive('uiNav', ['$timeout', function ($timeout) {
        return {
            restrict: 'AC',
            link: function (scope, el, attr) {
                $timeout(function () {
                    angular.element(el.find("li.active a").attr("data-id")).css({"display": "block"});
                }, 1);
                el.find('a').bind('click', function (e) {
                    var li = angular.element(this).parent();
                    li.parent().find('li').removeClass('active');
                    li.toggleClass('active');
                    li.find('ul') && (scope.app.asideCollapse = false);

                    var _target = angular.element(this.getAttribute("data-id")),
                        _targetParent = angular.element(this).parent().parent().parent().parent();
                    _targetParent.find("#profile-container .profile-pane").removeClass("active");
                    _targetParent.find("#profile-container .profile-pane").css({"display": "none"});
                    _target.css({"display": "block"});
                    $timeout(function () {
                        _target.toggleClass("active");
                    }, 20);
                });
            }
        };
    }])
    .directive('ngThumb', ['$window', function($window) {
        var helper = {
            support: !!($window.FileReader && $window.CanvasRenderingContext2D),
            isFile: function(item) {
                return angular.isObject(item) && item instanceof $window.File;
            },
            isImage: function(file) {
                var type =  '|' + file.type.slice(file.type.lastIndexOf('/') + 1) + '|';
                return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
            }
        };

        return {
            restrict: 'A',
            template: '<canvas/>',
            link: function(scope, element, attributes) {
                if (!helper.support) return;

                var params = scope.$eval(attributes.ngThumb);

                if (!helper.isFile(params.file)) return;
                if (!helper.isImage(params.file)) return;

                var canvas = element.find('canvas');
                var reader = new FileReader();

                reader.onload = onLoadFile;
                reader.readAsDataURL(params.file);

                function onLoadFile(event) {
                    var img = new Image();
                    img.onload = onLoadImage;
                    img.src = event.target.result;
                }

                function onLoadImage() {
                    var width = params.width || this.width / this.height * params.height;
                    var height = params.height || this.height / this.width * params.width;
                    canvas.attr({ width: width, height: height});
                    canvas.css({"max-width":"100%"});
                    canvas[0].getContext('2d').drawImage(this, 0, 0, width, height);
                }
            }
        };
    }])
;
'use strict';

/**
 * @ngdoc function
 * @name app.directive:uiFullscreen
 * @description
 * # uiFullscreen
 * Directive of the app
 */
angular.module('app')
  .directive('uiFullscreen', ['$ocLazyLoad', '$document', function($ocLazyLoad, $document) {
    return {
      restrict: 'AC',
      link: function(scope, el, attr) {
        el.addClass('hide');
        $ocLazyLoad.load('/Static/bower_components/screenfull/dist/screenfull.min.js').then(function(){
          if (screenfull.enabled) {
            el.removeClass('hide');
          }
          el.bind('click', function(){
            var target;
            attr.target && ( target = angular.element(attr.target)[0] );
            screenfull.toggle(target);
          });

          var body = angular.element($document[0].body);
          $document.on(screenfull.raw.fullscreenchange, function () {
            if(screenfull.isFullscreen){
              body.addClass('fullscreen');
            }else{
              body.removeClass('fullscreen');
            }
          });
        });
      }
    };
  }]);

'use strict';

/**
 * @ngdoc function
 * @name app.directive:uiScroll
 * @description
 * # uiScroll
 * Directive of the app
 */
angular.module('app')
  .directive('uiScroll', ['$location', '$anchorScroll', function($location, $anchorScroll) {
    return {
      restrict: 'AC',
      replace: true,
      link: function(scope, el, attr) {
        el.bind('click', function(e) {
          $location.hash(attr.uiScroll);
          $anchorScroll();
        });
      }
    };
  }]);
'use strict';

/**
 * @ngdoc function
 * @name app.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the app
 */
angular.module('app')
    .controller('MainCtrl', ['$scope', '$translate', '$localStorage', '$window', '$compile', 'FileUploader', "$alert", "cfpLoadingBar",
        function ($scope, $translate, $localStorage, $window, $compile, FileUploader, $alert, cfpLoadingBar) {
            //$scope.lsAlert = function (content, title, duration, type) {
            //    $alert({
            //        title: title || "提示",
            //        content: content || "提示信息",
            //        type: type || "info",
            //        duration: duration || 3,
            //        animation: 'am-fade-and-slide-top',
            //        placement: 'top-right',
            //        show: true
            //    });
            //};
            cfpLoadingBar.start();
            
            $scope.lsAlert = function (content, title, duration) {
                
            }

            $scope.dropdown = [
                {
                    "text": "<i class=\"fa fa-fw fa-download\"></i>&nbsp;Another action",
                    "href": "#anotherAction"
                },
                {
                    "text": "<i class=\"fa fa-fw fa-globe\"></i>&nbsp;Display an alert",
                    "click": "$alert(\"Holy guacamole!\")"
                },
                {
                    "text": "<i class=\"fa fa-fw fa-external-link\"></i>&nbsp;External link",
                    "href": "/auth/facebook",
                    "target": "_self"
                },
                {
                    "divider": true
                },
                {
                    "text": "Separated link",
                    "href": "#separatedLink"
                }
            ];

            $scope.ajaxFormSubmit = function(formId, url, data, callback) {
                if(url && (typeof url == "string")) {
                    $("#" + formId).ajaxSubmit({
                        //按钮上是否自定义提交地址(多按钮情况)
                        url: url,
                        dataType: 'json',
                        method: "post",
                        data: data || {},
                        beforeSubmit: function () {
                        },
                        success: function (result) {
                            callback && callback(result);
                        }
                    });
                } else {}
            };

            //var myAlert = $alert({title: 'Holy guacamole!', content: 'Best check yo self, you\'re not looking too good.', placement: 'top', type: 'info'});
            $scope.uploaderInfo = {};
            var uploader = $scope.uploader = new FileUploader({
                url: "/Index/upload",
                autoUpload: true,
                removeAfterUpload: true,
                queueLimit: 1,
                filter: "imageFilter"
            });

            uploader.filters.push({
                name: 'imageFilter',
                fn: function(item /*{File|FileLikeObject}*/, options) {
                    var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
                    return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
                }
            });

            uploader.onAfterAddingFile = function(fileItem) {
                $scope.uploader.queue[0].progress = 0;
            };
            //uploader.onBeforeUploadItem = function(item) {
            //    console.info('onBeforeUploadItem', item);
            //};
            //uploader.onSuccessItem = function(fileItem, response, status, headers) {
            //    console.info('onSuccessItem', fileItem, response, status, headers);
            //};
            //uploader.onErrorItem = function(fileItem, response, status, headers) {
            //    console.info('onErrorItem', fileItem, response, status, headers);
            //};
            uploader.onSuccessItem = function(item, response, status, headers) {

            };
            uploader.onCompleteItem = function(fileItem, response, status, headers) {
                setTimeout(function () {
                    uploader.queue = [];
                    //uploader.removeFromQueue(0);
                    $(".progress").eq(0).html($compile($(".progress").eq(0).html())($scope));
                    console.log($(".progress").eq(0).html())
                }, 3000);
                $scope.uploaderInfo = response.data;
            };

            // add 'ie' classes to html
            var isIE = !!navigator.userAgent.match(/MSIE/i) || !!navigator.userAgent.match(/Trident.*rv:11\./);
            isIE && angular.element($window.document.body).addClass('ie');
            isSmartDevice($window) && angular.element($window.document.body).addClass('smart');
            // config
            $scope.app = {
                name: _appName,
                version: '3.1',
                // for chart colors
                color: {
                    primary: '#155abb',
                    info: '#2772ee',
                    success: '#4bb622',
                    warning: '#f88311',
                    danger: '#e11144',
                    inverse: '#a66bee',
                    light: '#f1f2f3',
                    dark: '#202a3a'
                },
                settings: {
                    headerColor: 'bg-primary',
                    headerFixed: true,
                    headerShadow: true,
                    asideColor: 'bg-dark lt',
                    asideTop: false
                }
            }

            $scope.author = {
                name: _username
            };

            $scope.options = {
                headerColor: [
                    'bg-primary lt',
                    'bg-primary ',
                    'bg-primary dk',
                    'bg-info lt',
                    'bg-info',
                    'bg-info dk',
                    'bg-success lt',
                    'bg-success ',
                    'bg-success dk',
                    'bg-inverse lt',
                    'bg-inverse ',
                    'bg-inverse dk',
                    'bg-dark lt',
                    'bg-dark',
                    'bg-dark dk ',
                    'bg-black ',
                    'bg-black dk',
                    'bg-white box-shadow-md'
                ],
                asideColor: [
                    'bg-primary dk',
                    'bg-info dk',
                    'bg-success dk',
                    'bg-dark lt',
                    'bg-dark',
                    'bg-dark dk',
                    'bg-black lt',
                    'bg-black',
                    'bg-black dk',
                    'bg-white',
                    'bg-light',
                    'bg-light dk'
                ]
            };
            $scope.setHeaderColor = function (color) {
                $scope.app.settings.headerColor = color;
            }
            $scope.setAsideColor = function (color) {
                $scope.app.settings.asideColor = color;
            }

            // save settings to local storage
            if (angular.isDefined($localStorage.appSettings)) {
                $scope.app.settings = $localStorage.appSettings;
            } else {
                $localStorage.appSettings = $scope.app.settings;
            }
            $scope.$watch('app.settings', function () {
                $localStorage.appSettings = $scope.app.settings;
            }, true);

            // angular translate
            $scope.langs = {en: 'English', zh_CN: '中文'};
            $scope.selectLang = $scope.langs[$translate.proposedLanguage()] || "English";
            $scope.setLang = function (langKey) {
                // set the current lang
                $scope.selectLang = $scope.langs[langKey];
                // You can change the language during runtime
                $translate.use(langKey);
            };

            function isSmartDevice($window) {
                // Adapted from http://www.detectmobilebrowsers.com
                var ua = $window['navigator']['userAgent'] || $window['navigator']['vendor'] || $window['opera'];
                // Checks for iOs, Android, Blackberry, Opera Mini, and Windows mobile devices
                return (/iPhone|iPod|iPad|Silk|Android|BlackBerry|Opera Mini|IEMobile/).test(ua);
            }

            $.pjax.defaults.type = 'get';
            $(document).pjax("a[data-pjax]", "#p-container");
            $(document).on("pjax:start", function () {
            });
            $(document).on('pjax:complete', function () {
                $("#p-container").html($compile($("#p-container").html())($scope));
                setTimeout(function () {
                    var _target = document.querySelector("#p-container .container");
                    _target.style.opacity = 1;
                    _target.style.webkitTransform = "translate3d(0, 0, 0)";
                    _target.style.mozTransform = "translate3d(0, 0, 0)";
                    _target.style.oTransform = "translate3d(0, 0, 0)";
                    _target.style.transform = "translate3d(0, 0, 0)";
                }, 20);
            });

            // 个人中心资料修改
            // 修改个人资料
            $scope.modifyProfile = function () {
                $scope.ajaxFormSubmit("profile-form", "/Public/modifyProfile", {}, function (res) {
                    $scope.lsAlert(res.errmsg);
                    if(res.data.referer) {
                        location.href = res.data.referer;
                    }
                });
            };

            // 修改密码
            //$scope.modifyPassword = function () {
            //
            //}
            //var _modifyPassword = document.querySelector("#modify_password"),
            //    _oldPassword = document.querySelector("input[name='old_password']"),
            //    _newPassword = document.querySelector("input[name='new_password']"),
            //    _rePassword = document.querySelector("input[name='re_password']");
            //_modifyPassword.addEventListener("click", function () {
            //    if(_oldPassword && _oldPassword.value.trim() == "") {
            //        alert("请输入原始密码");
            //    } else if(_newPassword && _newPassword.value.trim() == "") {
            //        alert("请输入新密码");
            //    } else if (_rePassword && _rePassword.value.trim() == "") {
            //        alert("请确认新密码");
            //    } else if (_newPassword && _rePassword && _newPassword.value.trim() != _rePassword.value.trim()) {
            //        alert("确认新密码有误");
            //    } else {
            //        $.post("/Public/modifyPassword", {
            //            "old_password": _oldPassword && _oldPassword.value.trim(),
            //            "new_password": _newPassword && _newPassword.value.trim()
            //        }, function (res) {
            //            alert(res.errmsg);
            //            if(res.data.referer) {
            //                location.href = res.data.referer;
            //            }
            //        });
            //    }
            //}, false);
        }
    ]);

/*!
 * Copyright 2012, Chris Wanstrath
 * Released under the MIT License
 * https://github.com/defunkt/jquery-pjax
 */

(function($){

// When called on a container with a selector, fetches the href with
// ajax into the container or with the data-pjax attribute on the link
// itself.
//
// Tries to make sure the back button and ctrl+click work the way
// you'd expect.
//
// Exported as $.fn.pjax
//
// Accepts a jQuery ajax options object that may include these
// pjax specific options:
//
//
// container - Where to stick the response body. Usually a String selector.
//             $(container).html(xhr.responseBody)
//             (default: current jquery context)
//      push - Whether to pushState the URL. Defaults to true (of course).
//   replace - Want to use replaceState instead? That's cool.
//
// For convenience the second parameter can be either the container or
// the options object.
//
// Returns the jQuery object
    function fnPjax(selector, container, options) {
        var context = this
        return this.on('click.pjax', selector, function(event) {
            var opts = $.extend({}, optionsFor(container, options))
            if (!opts.container)
                opts.container = $(this).attr('data-pjax') || context
            handleClick(event, opts)
        })
    }

// Public: pjax on click handler
//
// Exported as $.pjax.click.
//
// event   - "click" jQuery.Event
// options - pjax options
//
// Examples
//
//   $(document).on('click', 'a', $.pjax.click)
//   // is the same as
//   $(document).pjax('a')
//
//  $(document).on('click', 'a', function(event) {
//    var container = $(this).closest('[data-pjax-container]')
//    $.pjax.click(event, container)
//  })
//
// Returns nothing.
    function handleClick(event, container, options) {
        options = optionsFor(container, options)

        var link = event.currentTarget

        if (link.tagName.toUpperCase() !== 'A')
            throw "$.fn.pjax or $.pjax.click requires an anchor element"

        // Middle click, cmd click, and ctrl click should open
        // links in a new tab as normal.
        if ( event.which > 1 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey )
            return

        // Ignore cross origin links
        if ( location.protocol !== link.protocol || location.hostname !== link.hostname )
            return

        // Ignore case when a hash is being tacked on the current URL
        if ( link.href.indexOf('#') > -1 && stripHash(link) == stripHash(location) )
            return

        // Ignore event with default prevented
        if (event.isDefaultPrevented())
            return

        var defaults = {
            url: link.href,
            container: $(link).attr('data-pjax'),
            target: link
        }

        var opts = $.extend({}, defaults, options)
        var clickEvent = $.Event('pjax:click')
        $(link).trigger(clickEvent, [opts])

        if (!clickEvent.isDefaultPrevented()) {
            pjax(opts)
            event.preventDefault()
            $(link).trigger('pjax:clicked', [opts])
        }
    }

// Public: pjax on form submit handler
//
// Exported as $.pjax.submit
//
// event   - "click" jQuery.Event
// options - pjax options
//
// Examples
//
//  $(document).on('submit', 'form', function(event) {
//    var container = $(this).closest('[data-pjax-container]')
//    $.pjax.submit(event, container)
//  })
//
// Returns nothing.
    function handleSubmit(event, container, options) {
        options = optionsFor(container, options)

        var form = event.currentTarget

        if (form.tagName.toUpperCase() !== 'FORM')
            throw "$.pjax.submit requires a form element"

        var defaults = {
            type: form.method.toUpperCase(),
            url: form.action,
            container: $(form).attr('data-pjax'),
            target: form
        }

        if (defaults.type !== 'GET' && window.FormData !== undefined) {
            defaults.data = new FormData(form);
            defaults.processData = false;
            defaults.contentType = false;
        } else {
            // Can't handle file uploads, exit
            if ($(form).find(':file').length) {
                return;
            }

            // Fallback to manually serializing the fields
            defaults.data = $(form).serializeArray();
        }

        pjax($.extend({}, defaults, options))

        event.preventDefault()
    }

// Loads a URL with ajax, puts the response body inside a container,
// then pushState()'s the loaded URL.
//
// Works just like $.ajax in that it accepts a jQuery ajax
// settings object (with keys like url, type, data, etc).
//
// Accepts these extra keys:
//
// container - Where to stick the response body.
//             $(container).html(xhr.responseBody)
//      push - Whether to pushState the URL. Defaults to true (of course).
//   replace - Want to use replaceState instead? That's cool.
//
// Use it just like $.ajax:
//
//   var xhr = $.pjax({ url: this.href, container: '#main' })
//   console.log( xhr.readyState )
//
// Returns whatever $.ajax returns.
    function pjax(options) {
        options = $.extend(true, {}, $.ajaxSettings, pjax.defaults, options)

        if ($.isFunction(options.url)) {
            options.url = options.url()
        }

        var target = options.target

        var hash = parseURL(options.url).hash

        var context = options.context = findContainerFor(options.container)

        // We want the browser to maintain two separate internal caches: one
        // for pjax'd partial page loads and one for normal page loads.
        // Without adding this secret parameter, some browsers will often
        // confuse the two.
        if (!options.data) options.data = {}
        if ($.isArray(options.data)) {
            options.data.push({name: '_p', value: context.selector})
        } else {
            options.data._p = context.selector
        }

        function fire(type, args, props) {
            if (!props) props = {}
            props.relatedTarget = target
            var event = $.Event(type, props)
            context.trigger(event, args)
            return !event.isDefaultPrevented()
        }

        var timeoutTimer

        options.beforeSend = function(xhr, settings) {
            // No timeout for non-GET requests
            // Its not safe to request the resource again with a fallback method.
            if (settings.type !== 'GET') {
                settings.timeout = 0
            }

            xhr.setRequestHeader('X-PJAX', 'true')
            xhr.setRequestHeader('X-PJAX-Container', context.selector)

            if (!fire('pjax:beforeSend', [xhr, settings]))
                return false

            if (settings.timeout > 0) {
                timeoutTimer = setTimeout(function() {
                    if (fire('pjax:timeout', [xhr, options]))
                        xhr.abort('timeout')
                }, settings.timeout)

                // Clear timeout setting so jquerys internal timeout isn't invoked
                settings.timeout = 0
            }

            var url = parseURL(settings.url)
            if (hash) url.hash = hash
            options.requestUrl = stripInternalParams(url)
        }

        options.complete = function(xhr, textStatus) {
            if (timeoutTimer)
                clearTimeout(timeoutTimer)

            fire('pjax:complete', [xhr, textStatus, options])

            fire('pjax:end', [xhr, options])
        }

        options.error = function(xhr, textStatus, errorThrown) {
            var container = extractContainer("", xhr, options)

            var allowed = fire('pjax:error', [xhr, textStatus, errorThrown, options])
            if (options.type == 'GET' && textStatus !== 'abort' && allowed) {
                locationReplace(container.url)
            }
        }

        options.success = function(data, status, xhr) {
            var previousState = pjax.state;

            // If $.pjax.defaults.version is a function, invoke it first.
            // Otherwise it can be a static string.
            var currentVersion = (typeof $.pjax.defaults.version === 'function') ?
                $.pjax.defaults.version() :
                $.pjax.defaults.version

            var latestVersion = xhr.getResponseHeader('X-PJAX-Version')

            var container = extractContainer(data, xhr, options)

            var url = parseURL(container.url)
            if (hash) {
                url.hash = hash
                container.url = url.href
            }

            // If there is a layout version mismatch, hard load the new url
            if (currentVersion && latestVersion && currentVersion !== latestVersion) {
                locationReplace(container.url)
                return
            }

            // If the new response is missing a body, hard load the page
            if (!container.contents) {
                locationReplace(container.url)
                return
            }

            pjax.state = {
                id: options.id || uniqueId(),
                url: container.url,
                title: container.title,
                container: context.selector,
                fragment: options.fragment,
                timeout: options.timeout
            }

            if (options.push || options.replace) {
                window.history.replaceState(pjax.state, container.title, container.url)
            }

            // Only blur the focus if the focused element is within the container.
            var blurFocus = $.contains(options.container, document.activeElement)

            // Clear out any focused controls before inserting new page contents.
            if (blurFocus) {
                try {
                    document.activeElement.blur()
                } catch (e) { }
            }

            if (container.title) document.title = container.title

            fire('pjax:beforeReplace', [container.contents, options], {
                state: pjax.state,
                previousState: previousState
            })
            context.html(container.contents)

            // FF bug: Won't autofocus fields that are inserted via JS.
            // This behavior is incorrect. So if theres no current focus, autofocus
            // the last field.
            //
            // http://www.w3.org/html/wg/drafts/html/master/forms.html
            var autofocusEl = context.find('input[autofocus], textarea[autofocus]').last()[0]
            if (autofocusEl && document.activeElement !== autofocusEl) {
                autofocusEl.focus();
            }

            executeScriptTags(container.scripts)

            var scrollTo = options.scrollTo

            // Ensure browser scrolls to the element referenced by the URL anchor
            if (hash) {
                var name = decodeURIComponent(hash.slice(1))
                var target = document.getElementById(name) || document.getElementsByName(name)[0]
                if (target) scrollTo = $(target).offset().top
            }

            if (typeof scrollTo == 'number') $(window).scrollTop(scrollTo)

            fire('pjax:success', [data, status, xhr, options])
        }


        // Initialize pjax.state for the initial page load. Assume we're
        // using the container and options of the link we're loading for the
        // back button to the initial page. This ensures good back button
        // behavior.
        if (!pjax.state) {
            pjax.state = {
                id: uniqueId(),
                url: window.location.href,
                title: document.title,
                container: context.selector,
                fragment: options.fragment,
                timeout: options.timeout
            }
            window.history.replaceState(pjax.state, document.title)
        }

        // Cancel the current request if we're already pjaxing
        abortXHR(pjax.xhr)

        pjax.options = options
        var xhr = pjax.xhr = $.ajax(options)

        if (xhr.readyState > 0) {
            if (options.push && !options.replace) {
                // Cache current container element before replacing it
                cachePush(pjax.state.id, cloneContents(context))

                window.history.pushState(null, "", options.requestUrl)
            }

            fire('pjax:start', [xhr, options])
            fire('pjax:send', [xhr, options])
        }

        return pjax.xhr
    }

// Public: Reload current page with pjax.
//
// Returns whatever $.pjax returns.
    function pjaxReload(container, options) {
        var defaults = {
            url: window.location.href,
            push: false,
            replace: true,
            scrollTo: false
        }

        return pjax($.extend(defaults, optionsFor(container, options)))
    }

// Internal: Hard replace current state with url.
//
// Work for around WebKit
//   https://bugs.webkit.org/show_bug.cgi?id=93506
//
// Returns nothing.
    function locationReplace(url) {
        window.history.replaceState(null, "", pjax.state.url)
        window.location.replace(url)
    }


    var initialPop = true
    var initialURL = window.location.href
    var initialState = window.history.state

// Initialize $.pjax.state if possible
// Happens when reloading a page and coming forward from a different
// session history.
    if (initialState && initialState.container) {
        pjax.state = initialState
    }

// Non-webkit browsers don't fire an initial popstate event
    if ('state' in window.history) {
        initialPop = false
    }

// popstate handler takes care of the back and forward buttons
//
// You probably shouldn't use pjax on pages with other pushState
// stuff yet.
    function onPjaxPopstate(event) {

        // Hitting back or forward should override any pending PJAX request.
        if (!initialPop) {
            abortXHR(pjax.xhr)
        }

        var previousState = pjax.state
        var state = event.state
        var direction

        if (state && state.container) {
            // When coming forward from a separate history session, will get an
            // initial pop with a state we are already at. Skip reloading the current
            // page.
            if (initialPop && initialURL == state.url) return

            if (previousState) {
                // If popping back to the same state, just skip.
                // Could be clicking back from hashchange rather than a pushState.
                if (previousState.id === state.id) return

                // Since state IDs always increase, we can deduce the navigation direction
                direction = previousState.id < state.id ? 'forward' : 'back'
            }

            var cache = cacheMapping[state.id] || []
            var container = $(cache[0] || state.container), contents = cache[1]

            if (container.length) {
                if (previousState) {
                    // Cache current container before replacement and inform the
                    // cache which direction the history shifted.
                    cachePop(direction, previousState.id, cloneContents(container))
                }

                var popstateEvent = $.Event('pjax:popstate', {
                    state: state,
                    direction: direction
                })
                container.trigger(popstateEvent)

                var options = {
                    id: state.id,
                    url: state.url,
                    container: container,
                    push: false,
                    fragment: state.fragment,
                    timeout: state.timeout,
                    scrollTo: false
                }

                if (contents) {
                    container.trigger('pjax:start', [null, options])

                    pjax.state = state
                    if (state.title) document.title = state.title
                    var beforeReplaceEvent = $.Event('pjax:beforeReplace', {
                        state: state,
                        previousState: previousState
                    })
                    container.trigger(beforeReplaceEvent, [contents, options])
                    container.html(contents)

                    container.trigger('pjax:end', [null, options])
                } else {
                    pjax(options)
                }

                // Force reflow/relayout before the browser tries to restore the
                // scroll position.
                container[0].offsetHeight
            } else {
                locationReplace(location.href)
            }
        }
        initialPop = false
    }

// Fallback version of main pjax function for browsers that don't
// support pushState.
//
// Returns nothing since it retriggers a hard form submission.
    function fallbackPjax(options) {
        var url = $.isFunction(options.url) ? options.url() : options.url,
            method = options.type ? options.type.toUpperCase() : 'GET'

        var form = $('<form>', {
            method: method === 'GET' ? 'GET' : 'POST',
            action: url,
            style: 'display:none'
        })

        if (method !== 'GET' && method !== 'POST') {
            form.append($('<input>', {
                type: 'hidden',
                name: '_method',
                value: method.toLowerCase()
            }))
        }

        var data = options.data
        if (typeof data === 'string') {
            $.each(data.split('&'), function(index, value) {
                var pair = value.split('=')
                form.append($('<input>', {type: 'hidden', name: pair[0], value: pair[1]}))
            })
        } else if ($.isArray(data)) {
            $.each(data, function(index, value) {
                form.append($('<input>', {type: 'hidden', name: value.name, value: value.value}))
            })
        } else if (typeof data === 'object') {
            var key
            for (key in data)
                form.append($('<input>', {type: 'hidden', name: key, value: data[key]}))
        }

        $(document.body).append(form)
        form.submit()
    }

// Internal: Abort an XmlHttpRequest if it hasn't been completed,
// also removing its event handlers.
    function abortXHR(xhr) {
        if ( xhr && xhr.readyState < 4) {
            xhr.onreadystatechange = $.noop
            xhr.abort()
        }
    }

// Internal: Generate unique id for state object.
//
// Use a timestamp instead of a counter since ids should still be
// unique across page loads.
//
// Returns Number.
    function uniqueId() {
        return (new Date).getTime()
    }

    function cloneContents(container) {
        var cloned = container.clone()
        // Unmark script tags as already being eval'd so they can get executed again
        // when restored from cache. HAXX: Uses jQuery internal method.
        cloned.find('script').each(function(){
            if (!this.src) jQuery._data(this, 'globalEval', false)
        })
        return [container.selector, cloned.contents()]
    }

// Internal: Strip internal query params from parsed URL.
//
// Returns sanitized url.href String.
    function stripInternalParams(url) {
        url.search = url.search.replace(/([?&])(_p|_)=[^&]*/g, '')
        return url.href.replace(/\?($|#)/, '$1')
    }

// Internal: Parse URL components and returns a Locationish object.
//
// url - String URL
//
// Returns HTMLAnchorElement that acts like Location.
    function parseURL(url) {
        var a = document.createElement('a')
        a.href = url
        return a
    }

// Internal: Return the `href` component of given URL object with the hash
// portion removed.
//
// location - Location or HTMLAnchorElement
//
// Returns String
    function stripHash(location) {
        return location.href.replace(/#.*/, '')
    }

// Internal: Build options Object for arguments.
//
// For convenience the first parameter can be either the container or
// the options object.
//
// Examples
//
//   optionsFor('#container')
//   // => {container: '#container'}
//
//   optionsFor('#container', {push: true})
//   // => {container: '#container', push: true}
//
//   optionsFor({container: '#container', push: true})
//   // => {container: '#container', push: true}
//
// Returns options Object.
    function optionsFor(container, options) {
        // Both container and options
        if ( container && options )
            options.container = container

        // First argument is options Object
        else if ( $.isPlainObject(container) )
            options = container

        // Only container
        else
            options = {container: container}

        // Find and validate container
        if (options.container)
            options.container = findContainerFor(options.container)

        return options
    }

// Internal: Find container element for a variety of inputs.
//
// Because we can't persist elements using the history API, we must be
// able to find a String selector that will consistently find the Element.
//
// container - A selector String, jQuery object, or DOM Element.
//
// Returns a jQuery object whose context is `document` and has a selector.
    function findContainerFor(container) {
        container = $(container)

        if ( !container.length ) {
            throw "no pjax container for " + container.selector
        } else if ( container.selector !== '' && container.context === document ) {
            return container
        } else if ( container.attr('id') ) {
            return $('#' + container.attr('id'))
        } else {
            throw "cant get selector for pjax container!"
        }
    }

// Internal: Filter and find all elements matching the selector.
//
// Where $.fn.find only matches descendants, findAll will test all the
// top level elements in the jQuery object as well.
//
// elems    - jQuery object of Elements
// selector - String selector to match
//
// Returns a jQuery object.
    function findAll(elems, selector) {
        return elems.filter(selector).add(elems.find(selector));
    }

    function parseHTML(html) {
        return $.parseHTML(html, document, true)
    }

// Internal: Extracts container and metadata from response.
//
// 1. Extracts X-PJAX-URL header if set
// 2. Extracts inline <title> tags
// 3. Builds response Element and extracts fragment if set
//
// data    - String response data
// xhr     - XHR response
// options - pjax options Object
//
// Returns an Object with url, title, and contents keys.
    function extractContainer(data, xhr, options) {
        var obj = {}, fullDocument = /<html/i.test(data)

        // Prefer X-PJAX-URL header if it was set, otherwise fallback to
        // using the original requested url.
        var serverUrl = xhr.getResponseHeader('X-PJAX-URL')
        obj.url = serverUrl ? stripInternalParams(parseURL(serverUrl)) : options.requestUrl

        // Attempt to parse response html into elements
        if (fullDocument) {
            var $head = $(parseHTML(data.match(/<head[^>]*>([\s\S.]*)<\/head>/i)[0]))
            var $body = $(parseHTML(data.match(/<body[^>]*>([\s\S.]*)<\/body>/i)[0]))
        } else {
            var $head = $body = $(parseHTML(data))
        }

        // If response data is empty, return fast
        if ($body.length === 0)
            return obj

        // If there's a <title> tag in the header, use it as
        // the page's title.
        obj.title = findAll($head, 'title').last().text()

        if (options.fragment) {
            // If they specified a fragment, look for it in the response
            // and pull it out.
            if (options.fragment === 'body') {
                var $fragment = $body
            } else {
                var $fragment = findAll($body, options.fragment).first()
            }

            if ($fragment.length) {
                obj.contents = options.fragment === 'body' ? $fragment : $fragment.contents()

                // If there's no title, look for data-title and title attributes
                // on the fragment
                if (!obj.title)
                    obj.title = $fragment.attr('title') || $fragment.data('title')
            }

        } else if (!fullDocument) {
            obj.contents = $body
        }

        // Clean up any <title> tags
        if (obj.contents) {
            // Remove any parent title elements
            obj.contents = obj.contents.not(function() { return $(this).is('title') })

            // Then scrub any titles from their descendants
            obj.contents.find('title').remove()

            // Gather all script[src] elements
            obj.scripts = findAll(obj.contents, 'script[src]').remove()
            obj.contents = obj.contents.not(obj.scripts)
        }

        // Trim any whitespace off the title
        if (obj.title) obj.title = $.trim(obj.title)

        return obj
    }

// Load an execute scripts using standard script request.
//
// Avoids jQuery's traditional $.getScript which does a XHR request and
// globalEval.
//
// scripts - jQuery object of script Elements
//
// Returns nothing.
    function executeScriptTags(scripts) {
        if (!scripts) return

        var existingScripts = $('script[src]')

        scripts.each(function() {
            var src = this.src
            var matchedScripts = existingScripts.filter(function() {
                return this.src === src
            })
            if (matchedScripts.length) return

            var script = document.createElement('script')
            var type = $(this).attr('type')
            if (type) script.type = type
            script.src = $(this).attr('src')
            document.head.appendChild(script)
        })
    }

// Internal: History DOM caching class.
    var cacheMapping      = {}
    var cacheForwardStack = []
    var cacheBackStack    = []

// Push previous state id and container contents into the history
// cache. Should be called in conjunction with `pushState` to save the
// previous container contents.
//
// id    - State ID Number
// value - DOM Element to cache
//
// Returns nothing.
    function cachePush(id, value) {
        cacheMapping[id] = value
        cacheBackStack.push(id)

        // Remove all entries in forward history stack after pushing a new page.
        trimCacheStack(cacheForwardStack, 0)

        // Trim back history stack to max cache length.
        trimCacheStack(cacheBackStack, pjax.defaults.maxCacheLength)
    }

// Shifts cache from directional history cache. Should be
// called on `popstate` with the previous state id and container
// contents.
//
// direction - "forward" or "back" String
// id        - State ID Number
// value     - DOM Element to cache
//
// Returns nothing.
    function cachePop(direction, id, value) {
        var pushStack, popStack
        cacheMapping[id] = value

        if (direction === 'forward') {
            pushStack = cacheBackStack
            popStack  = cacheForwardStack
        } else {
            pushStack = cacheForwardStack
            popStack  = cacheBackStack
        }

        pushStack.push(id)
        if (id = popStack.pop())
            delete cacheMapping[id]

        // Trim whichever stack we just pushed to to max cache length.
        trimCacheStack(pushStack, pjax.defaults.maxCacheLength)
    }

// Trim a cache stack (either cacheBackStack or cacheForwardStack) to be no
// longer than the specified length, deleting cached DOM elements as necessary.
//
// stack  - Array of state IDs
// length - Maximum length to trim to
//
// Returns nothing.
    function trimCacheStack(stack, length) {
        while (stack.length > length)
            delete cacheMapping[stack.shift()]
    }

// Public: Find version identifier for the initial page load.
//
// Returns String version or undefined.
    function findVersion() {
        return $('meta').filter(function() {
            var name = $(this).attr('http-equiv')
            return name && name.toUpperCase() === 'X-PJAX-VERSION'
        }).attr('content')
    }

// Install pjax functions on $.pjax to enable pushState behavior.
//
// Does nothing if already enabled.
//
// Examples
//
//     $.pjax.enable()
//
// Returns nothing.
    function enable() {
        $.fn.pjax = fnPjax
        $.pjax = pjax
        $.pjax.enable = $.noop
        $.pjax.disable = disable
        $.pjax.click = handleClick
        $.pjax.submit = handleSubmit
        $.pjax.reload = pjaxReload
        $.pjax.defaults = {
            timeout: 650,
            push: true,
            replace: false,
            type: 'GET',
            dataType: 'html',
            scrollTo: 0,
            maxCacheLength: 20,
            version: findVersion
        }
        $(window).on('popstate.pjax', onPjaxPopstate)
    }

// Disable pushState behavior.
//
// This is the case when a browser doesn't support pushState. It is
// sometimes useful to disable pushState for debugging on a modern
// browser.
//
// Examples
//
//     $.pjax.disable()
//
// Returns nothing.
    function disable() {
        $.fn.pjax = function() { return this }
        $.pjax = fallbackPjax
        $.pjax.enable = enable
        $.pjax.disable = $.noop
        $.pjax.click = $.noop
        $.pjax.submit = $.noop
        $.pjax.reload = function() { window.location.reload() }

        $(window).off('popstate.pjax', onPjaxPopstate)
    }


// Add the state property to jQuery's event object so we can use it in
// $(window).bind('popstate')
    if ( $.inArray('state', $.event.props) < 0 )
        $.event.props.push('state')

// Is pjax supported by this browser?
    $.support.pjax =
        window.history && window.history.pushState && window.history.replaceState &&
            // pushState isn't reliable on iOS until 5.
        !navigator.userAgent.match(/((iPod|iPhone|iPad).+\bOS\s+[1-4]\D|WebApps\/.+CFNetwork)/)

    $.support.pjax ? enable() : disable()

})(jQuery);