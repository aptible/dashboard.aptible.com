import Ember from 'ember';

export default Ember.Route.extend({
  model(params) {
    return new Ember.RSVP.Promise((resolve) => {
      this.authorization.load().then((authorization) => {
        resolve(authorization.getContext(params.organization_id));
      });
    });
  },

  renderTemplate() {
    this._super.apply(this, arguments);
    this.render('sidebars/settings', {
      into: 'organization',
      outlet: 'sidebar'
    });
  }
});
