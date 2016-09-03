import Ember from 'ember';

export default Ember.Route.extend({
  setupController(controller) {
    let context = this.modelFor('organization');
    controller.set('organization', context.get('organization'));
  }
});
