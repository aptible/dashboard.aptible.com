module.exports = {
  normalizeEntityName: function() { },
  afterInstall: function() {
    return this.addBowerPackagesToProject([
      { name: 'animate',        source: 'daneden/animate.css' },
      { name: 'bootstrap-sass', source: 'twbs/bootstrap-sass' },
      { name: 'clipboard',  target: '~1.3.1' }
    ]);
  }
};
