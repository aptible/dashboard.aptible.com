module.exports = {
  normalizeEntityName: function() { },
  afterInstall: function() {
    return this.addBowerPackagesToProject([
      { name: 'animate',        source: 'daneden/animate.css' },
      { name: 'bootstrap-sass', source: 'twbs/bootstrap-sass' },
      { name: 'zeroclipboard',  target: '~2.2.0'   }
    ]);
  }
};