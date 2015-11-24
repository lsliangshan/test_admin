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