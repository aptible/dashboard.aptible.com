import SetupRoute from 'diesel/gridiron-setup/route';

export default SetupRoute.extend({
  redirect() {
    let hasSPD = this.get('complianceStatus.authorizationContext.enabledFeatures.spd');

    if(!hasSPD) {
      this.transitionTo('gridiron-admin');
    }
  },

  renderTemplate() {
    this._super.apply(this, arguments);
    this.render('sidebars/engine-sidebar', { into: 'gridiron-settings', outlet: 'sidebar' });
  }
});