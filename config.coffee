exports.config =
  modules:
    definition: false
    wrapper: false
  files:
    javascripts:
      defaultExtension: 'coffee'
      joinTo:
        'js/vendor.js': /^bower_components/
        'js/app.js': /^app\/(scripts|config)/
      order:
        before: [
          'bower_components/jquery/jquery.js'
          'bower_components/angular/angular.js'
          'bower_components/bootstrap-sass-official/assets/javascripts/bootstrap.js'
        ]
    stylesheets:
      defaultExtension: 'sass'
      joinTo:
        'css/app.css': /^(app\/css|vendor|bower_components)/
  framework: 'angular'
  minify: yes