import Ember from 'ember';

export default Ember.Route.extend({
  model(params) {
    return this.get('authorization').getContext(params.organization_id);
  },

  renderTemplate() {
    this._super.apply(this, arguments);
    this.render('sidebars/settings', {
      into: 'organization',
      outlet: 'sidebar'
    });
  }
});
