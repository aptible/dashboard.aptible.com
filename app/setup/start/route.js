import Ember from 'ember';
import { STEPS } from '../../components/spd-nav/component';

export default Ember.Route.extend({
  model() {
    return STEPS;
  },

  actions: {
    onNext() {
      let profile = this.modelFor('setup');

      profile.next();
      profile.save().then(() => {
        this.transitionTo(`setup.${profile.get('currentStep')}`);
      });
    }
  }
});
