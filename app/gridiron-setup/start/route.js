import Ember from 'ember';
import { STEPS } from 'diesel/components/spd-nav/component';
import SPDRouteMixin from 'diesel/mixins/routes/spd-route';

export default Ember.Route.extend(SPDRouteMixin, {
  redirect() {
    let profile = this.modelFor('gridiron-setup');
    let currentStep = profile.get('currentStep');

    if(currentStep) {
      return this.transitionTo(`gridiron-setup.${currentStep}`);
    }
  },

  model() {
    return STEPS;
  }
});
