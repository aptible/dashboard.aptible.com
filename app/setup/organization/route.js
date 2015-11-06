import Ember from 'ember';

export default Ember.Route.extend({
  model() {
    return this.modelFor('setup');
  },

  actions: {
    onNext(nextPath) {
      let profile = this.currentModel;

      profile.next();
      profile.save().then(() => {
        this.transitionTo(`setup.${profile.get('currentStep')}`);
      });
    }
  }
});
