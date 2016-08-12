import Ember from "ember";

export default Ember.Route.extend({
  titleToken() {
    var app = this.modelFor('app');
    return `${app.get('handle')} Endpoints`;
  },

  redirect(model) {
    if(model.get('length') === 0) {
      return this.transitionTo('app.vhosts.new', this.modelFor('app'));
    }
  },

  actions: {
    startDeletion() {
      this.controller.set('error', null);
    },

    failDeletion(/* e */) {
      this.controller.set('error', 'There was an error deleting the endpoint.');
    },

    completeDeletion() {
      this.controller.set('error', null);
    }
  }
});
