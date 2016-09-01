import Ember from 'ember';

export default Ember.Route.extend({
  model() {
    return this.authorization.load();
  },

  renderTemplate() {
    this._super.apply(this, arguments);
    this.render('sidebars/settings', {
      into: 'settings',
      outlet: 'sidebar'
    });
  }
});
