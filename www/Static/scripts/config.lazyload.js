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
              '/Static/bower_components/angular-file-upload/angular-file-upload.min.js'
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
