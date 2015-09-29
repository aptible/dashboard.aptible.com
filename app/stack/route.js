import Ember from 'ember';

export default Ember.Route.extend({
  title(tokens) {
    var stack = this.modelFor('stack');
    return `${stack.get('handle')} Environment`;
  },

  model(params) {
    // TODO: [ember-data-upgrade] This shouldn't be necessary, but we're way
    // but we this prevents re-fetching an organization that is already loaded
    let stacks = this.modelFor('dashboard').stacks;
    return stacks.findBy('id', params.stack_id);
  },

  setupController(controller, model) {
    controller.set('model', model);
    controller.set('organizations', this.modelFor('dashboard').organizations);
    // Use store.all here to load stack listing from store
    controller.set('stacks', this.store.all('stack'));
  },

  renderTemplate() {
    this._super.apply(this, arguments);
    this.render('sidebars/organizations-stacks', {
      into: 'dashboard',
      outlet: 'sidebar'
    });
  }
});
