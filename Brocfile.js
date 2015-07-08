/* global require, module, process */

var EmberApp = require('ember-cli/lib/broccoli/ember-app');

var options = {
  emberCliFontAwesome: { includeFontAwesomeAssets: false },
  vendorFiles: {
    'handlebars.js': null
  }
};

if (process.env.EMBER_ENV === 'staging') {
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

var app = new EmberApp(options);

app.import('bower_components/nouislider/src/jquery.nouislider.css');
app.import('bower_components/nouislider/distribute/jquery.nouislider.js');

// tooltips, popovers
app.import('bower_components/bootstrap/dist/js/bootstrap.js');
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

// Should become and addon or use a tree
app.import('bower_components/aptible-sass/dist/images/aptible-circle-logo.png', { destDir: "images" });
app.import('bower_components/aptible-sass/dist/images/aptible-mark.png', { destDir: "images" });
app.import('bower_components/aptible-sass/dist/images/aptible-mark@2x.png', { destDir: "images" });
app.import('bower_components/aptible-sass/dist/images/nav-logo-dark.png', { destDir: "images" });
app.import('bower_components/aptible-sass/dist/images/nav-logo-dark@2x.png', { destDir: "images" });
app.import('bower_components/aptible-sass/dist/images/nav-logo.png', { destDir: "images" });
app.import('bower_components/aptible-sass/dist/images/nav-logo@2x.png', { destDir: "images" });

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

module.exports = app.toTree();
