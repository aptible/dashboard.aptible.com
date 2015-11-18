import Ember from 'ember';

export default Ember.Route.extend({
  setupController(controller, model) {
    controller.set('organizations', this.modelFor('index'));
    controller.set('organization', this.modelFor('organization'));
  },

  renderTemplate() {
    this._super.apply(this, arguments);
    this.render('sidebars/engine-sidebar', { into: 'engines', outlet: 'sidebar' });
  }
});
