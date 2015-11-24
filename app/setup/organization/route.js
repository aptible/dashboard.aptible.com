import Ember from 'ember';

export default Ember.Route.extend({
  model() {
    return this.modelFor('setup');
  },

  afterModel() {
    let profile = this.modelFor('setup');

    if(!profile.isReadyForStep('organization')) {
      return this.transitionTo(`setup.${profile.get('currentStep')}`);
    }
  },

  actions: {
    onNext() {
      let profile = this.currentModel;

      profile.next();
      profile.save().then(() => {
        this.transitionTo(`setup.${profile.get('currentStep')}`);
      });
    }
  }
});
