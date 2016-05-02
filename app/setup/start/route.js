import Ember from 'ember';
import { STEPS } from 'diesel/components/spd-nav/component';
import SPDRouteMixin from 'diesel/mixins/routes/spd-route';

export default Ember.Route.extend(SPDRouteMixin, {
  redirect() {
    let profile = this.modelFor('setup');
    let currentStep = profile.get('currentStep');

    if(currentStep) {
      return this.transitionTo(`setup.${currentStep}`);
    }
  },

  model() {
    return STEPS;
  }
});
