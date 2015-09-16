/* global require, module, process */
var EmberApp = require('ember-cli/lib/broccoli/ember-app');

module.exports = function(defaults) {
  var options = {
    emberCliFontAwesome: { includeFontAwesomeAssets: false },
    vendorFiles: {
      'handlebars.js': null
    }
  };

  if (process.env.EMBER_ENV === 'staging' || process.env.EMBER_ENV === 'sandbox') {
    options.minifyCSS = {
      enabled: true
    };
    options.minifyJS = {
      enabled: true
    };
    options.fingerprint = {
      enabled: true
    };
    options.sourcemaps = {
      enabled: false
    };
  }

  var app = new EmberApp(defaults, options);

  app.import('bower_components/nouislider/src/jquery.nouislider.css');
  app.import('bower_components/nouislider/distribute/jquery.nouislider.js');

  // tooltips, popovers
  app.import('bower_components/bootstrap-sass/assets/javascripts/bootstrap.js');
  app.import('bower_components/bootstrap-sass/assets/stylesheets/_bootstrap.scss');

  app.import('bower_components/animate/animate.css');
  app.import("bower_components/font-awesome/css/font-awesome.css");
  app.import("bower_components/font-awesome/fonts/fontawesome-webfont.eot", { destDir: "fonts" });
  app.import("bower_components/font-awesome/fonts/fontawesome-webfont.svg", { destDir: "fonts" });
  app.import("bower_components/font-awesome/fonts/fontawesome-webfont.ttf", { destDir: "fonts" });
  app.import("bower_components/font-awesome/fonts/fontawesome-webfont.woff", { destDir: "fonts" });
  app.import("bower_components/font-awesome/fonts/FontAwesome.otf", { destDir: "fonts" });

  app.import("bower_components/zeroclipboard/dist/ZeroClipboard.js");
  app.import("bower_components/zeroclipboard/dist/ZeroClipboard.swf", {
    destDir: "assets"
  });

  // Use `app.import` to add additional libraries to the generated
  // output files.
  //
  // If you need to use different assets in different
  // environments, specify an object as the first parameter. That
  // object's keys should be the environment name and the values
  // should be the asset to use in that environment.
  //
  // If the library that you are including contains AMD or ES6
  // modules that you would like to import into your application
  // please specify an object with the list of modules as keys
  // along with the exports of each module as its value.

  return app.toTree();
};
