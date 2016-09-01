import Ember from 'ember';

export default Ember.Route.extend({
  setupController(controller, model) {
    let contextHref = model.get('data.links.organization');
    let context = this.get('authorization').getContextByHref(contextHref);

    controller.set('model', model);
    controller.set('context', context);
  },

  renderTemplate() {
    this._super.apply(this, arguments);
    this.render('sidebars/settings', {
      into: 'enclave',
      outlet: 'sidebar'
    });
  }
});
