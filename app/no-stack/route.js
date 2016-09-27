import Ember from 'ember';

export default Ember.Route.extend({
  renderTemplate() {
    this._super.apply(this, arguments);
    this.render('sidebars/organizations-stacks', {
      into: 'enclave',
      outlet: 'sidebar'
    });
  }
});
