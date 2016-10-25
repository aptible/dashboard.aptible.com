import Ember from 'ember';

export default Ember.Route.extend({
  redirect() {
    let profile = this.modelFor('gridiron-setup');
    let currentStep = profile.get('currentStep') || 'start';

    return this.transitionTo(`gridiron-setup.${currentStep}`);
  }
});
