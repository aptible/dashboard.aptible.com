import Ember from 'ember';
import { STEPS } from '../../components/spd-nav/component';
import SPDRouteMixin from 'sheriff/mixins/routes/spd-route';

export default Ember.Route.extend(SPDRouteMixin, {
  redirect() {
    let profile = this.modelFor('setup');
    let currentStep = profile.get('currentStep');

    return this.transitionTo(`setup.${currentStep}`);
  },

  model() {
    return STEPS;
  }
});
