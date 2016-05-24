import Ember from 'ember';

export default Ember.Route.extend({
  redirect() {
    let profile = this.modelFor('setup');
    let currentStep = profile.get('currentStep') || 'start';

    return this.transitionTo(`setup.${currentStep}`);
  }
});
