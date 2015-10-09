import Ember from 'ember';

export default Ember.Route.extend({
  title() {
    var stack = this.modelFor('stack');
    return `${stack.get('handle')} Environment`;
  },

  setupController(controller, model) {
    controller.set('model', model);
    controller.set('organizations', this.modelFor('dashboard').organizations);
    controller.set('stacks', this.modelFor('dashboard').stacks);
  },

  renderTemplate() {
    this._super.apply(this, arguments);
    this.render('sidebars/organizations-stacks', {
      into: 'dashboard',
      outlet: 'sidebar'
    });
  }
});
