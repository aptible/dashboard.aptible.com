import Ember from 'ember';

export default Ember.Route.extend({
  title() {
    var stack = this.modelFor('stack');
    return `${stack.get('handle')} Environment`;
  },

  renderTemplate() {
    this._super.apply(this, arguments);
    this.render('sidebars/organizations-stacks', {
      into: 'dashboard',
      outlet: 'sidebar'
    });
  }
});
