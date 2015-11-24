'use strict';

/**
 * @ngdoc function
 * @name app.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the app
 */
angular.module('app')
    .controller('MainCtrl', ['$scope', '$translate', '$localStorage', '$window', '$compile', 'FileUploader',
        function ($scope, $translate, $localStorage, $window, $compile, FileUploader) {

            var uploader = $scope.uploader = new FileUploader({
                url: "/Index/upload",
                //autoUpload: true,
                //removeAfterUpload: true,
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

            //uploader.onAfterAddingFile = function(fileItem) {
            //    console.info('onAfterAddingFile', fileItem);
            //};
            //uploader.onBeforeUploadItem = function(item) {
            //    console.info('onBeforeUploadItem', item);
            //};
            //uploader.onSuccessItem = function(fileItem, response, status, headers) {
            //    console.info('onSuccessItem', fileItem, response, status, headers);
            //};
            //uploader.onErrorItem = function(fileItem, response, status, headers) {
            //    console.info('onErrorItem', fileItem, response, status, headers);
            //};
            uploader.onCompleteItem = function(fileItem, response, status, headers) {
                //console.info('onCompleteItem', fileItem, response, status, headers);
                $scope.uploader.progress = 0;
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
        }
    ]);
