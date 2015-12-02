module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            //            <script src="/Static/"></script>
            //            <script src="/Static/bower_components/angular-cookies/angular-cookies.js"></script>
            //        <script src="/Static/bower_components/angular-resource/angular-resource.js"></script>
            //    <script src="/Static/bower_components/angular-sanitize/angular-sanitize.js"></script>
            //    <script src="/Static/bower_components/angular-touch/angular-touch.js"></script>
            //    <!-- Vendor -->
            //    <script src="/Static/bower_components/angular-ui-router/release/angular-ui-router.js"></script>
            //    <script src="/Static/bower_components/ngstorage/ngStorage.js"></script>
            //    <script src="/Static/bower_components/angular-ui-utils/ui-utils.js"></script>
            //
            //    <!-- angular-strap -->
            //    <script src="/Static/bower_components/angular-strap/dist/angular-strap.js"></script>
            //    <script src="/Static/bower_components/angular-strap/dist/angular-strap.tpl.js"></script>
            //    <!-- lazyload -->
            //    <script src="/Static/bower_components/oclazyload/dist/ocLazyLoad.js"></script>
            //    <!-- translate -->
            //    <script src="/Static/bower_components/angular-translate/angular-translate.js"></script>
            //    <script src="/Static/bower_components/angular-translate-loader-static-files/angular-translate-loader-static-files.js"></script>
            //    <script src="/Static/bower_components/angular-translate-storage-cookie/angular-translate-storage-cookie.js"></script>
            //    <script src="/Static/bower_components/angular-translate-storage-local/angular-translate-storage-local.js"></script>
            //    <!-- loading-bar -->
            //    <script src="/Static/bower_components/angular-loading-bar/build/loading-bar.js"></script>
            //    <!-- angular file uploader-->
            //<script src="/Static/bower_components/angular-file-upload/angular-file-upload.js"></script>
            dynamic_mappings: {
                files: [
                    {
                        expand: true,
                        cwd: 'scripts/',
                        src: '**/*.js',
                        dest: 'build/scripts/',
                        ext: '.min.js',
                        extDot: 'last'
                    }
                ]
            }
        },
        cssmin: {
            target: {
                files: [
                    {
                        expand: true,
                        cwd: "styles/",
                        src: ["*.css", "!*.min.css"],
                        dest: "build/styles",
                        ext: ".min.css"
                    }
                ]
            }
        },
        concat: {
            dist: {
                src: [
                    //"scripts/app.js",
                    //"scripts/config.js",
                    //"scripts/services/ui-load.js",
                    //"scripts/config.router.js",
                    //"scripts/config.router.ui.js",
                    //"scripts/config.router.pages.js",
                    //"scripts/config.lazyload.js",
                    //"scripts/directives/lazyload.js",
                    //"scripts/directives/ui-jp.js",
                    //"scripts/directives/ui-nav.js",
                    //"scripts/directives/ui-fullscreen.js",
                    //"scripts/directives/ui-scroll.js",
                    //"scripts/main.js",
                    //"scripts/jquery.pjax.js"

                    "build/scripts/config.min.js",
                    "build/scripts/services/ui-load.min.js",
                    "build/scripts/config.router.min.js",
                    "build/scripts/config.router.ui.min.js",
                    "build/scripts/config.router.pages.min.js",
                    "build/scripts/config.lazyload.min.js",
                    "build/scripts/directives/lazyload.min.js",
                    "build/scripts/directives/ui-jp.min.js",
                    "build/scripts/directives/ui-nav.min.js",
                    "build/scripts/directives/ui-fullscreen.min.js",
                    "build/scripts/directives/ui-scroll.min.js",
                    "build/scripts/main.min.js",
                    "build/scripts/jquery.pjax.min.js"
                ],
                dest: "build/scripts/index.min.js"
            }
        },
        watch: {
            scripts: {
                files: "**/*",
                tasks: ["uglify", "concat", "cssmin"]
            }
        }
    });

    // 加载包含 "uglify" 任务的插件。
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks("grunt-contrib-concat");
    grunt.loadNpmTasks("grunt-contrib-cssmin");
    grunt.loadNpmTasks("grunt-contrib-watch");

    // 默认被执行的任务列表。
    grunt.registerTask('default', ['uglify', "concat", "cssmin", "watch"]);

};