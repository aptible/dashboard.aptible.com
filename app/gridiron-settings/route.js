import SetupRoute from 'diesel/setup/route';

export default SetupRoute.extend({
  redirect() {
    if(!this.get('authorization.features.spd')) {
      this.transitionTo('gridiron-admin');
    }
  },

  renderTemplate() {
    this._super.apply(this, arguments);
    this.render('sidebars/engine-sidebar', { into: 'gridiron-settings', outlet: 'sidebar' });
  }
});