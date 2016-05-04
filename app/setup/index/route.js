import Ember from 'ember';

export default Ember.Route.extend({
  redirect() {
    let profile = this.modelFor('setup');
    let currentStep = profile.get('currentStep');

    return this.transitionTo(`setup.${currentStep}`);
  }
});
