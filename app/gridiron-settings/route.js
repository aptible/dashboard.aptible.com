import SetupRoute from 'diesel/setup/route';

export default SetupRoute.extend({
  renderTemplate() {
    this._super.apply(this, arguments);
    this.render('sidebars/engine-sidebar', { into: 'gridiron-settings', outlet: 'sidebar' });
  }
});