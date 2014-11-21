var path = require('path');

module.exports = {
  name: "bootstrap-sass",
  included: function included(app) {
    if (!app.options.sassOptions) {
      app.options.sassOptions = {
        includePaths: []
      }
    }

    app.options.sassOptions.includePaths.push(
      'bower_components/bootstrap-sass/assets/stylesheets'
    )

    app.import("bower_components/bootstrap-sass/assets/fonts/bootstrap/glyphicons-halflings-regular.eot", { destDir: "fonts/bootstrap" });
    app.import("bower_components/bootstrap-sass/assets/fonts/bootstrap/glyphicons-halflings-regular.svg", { destDir: "fonts/bootstrap" });
    app.import("bower_components/bootstrap-sass/assets/fonts/bootstrap/glyphicons-halflings-regular.ttf", { destDir: "fonts/bootstrap" });
    app.import("bower_components/bootstrap-sass/assets/fonts/bootstrap/glyphicons-halflings-regular.woff", { destDir: "fonts/bootstrap" });

  },
  treeFor: function(name){
    if (name === 'styles') {
      return this.treeGenerator(
        path.join(__dirname, '../../bower_components/bootstrap-sass/assets/stylesheets')
      );
    }
  }
};
