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