import Ember from 'ember';

export default Ember.Route.extend({
  redirect() {
    let model = this.modelFor('compliance-organization');
    return this.transitionTo('compliance-organization', model.get('firstObject'));
  }
});

