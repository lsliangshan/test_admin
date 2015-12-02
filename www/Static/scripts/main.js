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
                    $(".progress").eq(0).find(".progress-bar").eq(0).css({"width": "0%"});
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
