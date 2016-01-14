import Ember from 'ember';

export default Ember.Mixin.create({
  stepName: Ember.computed('routeName', function() {
    return this.get('routeName').split('.').get('lastObject');
  }),

  beforeModel() {
    let profile = this.modelFor('setup');

    if(!profile.isReadyForStep(this.get('stepName'))) {
      return this.transitionTo(`setup.${profile.get('currentStep')}`);
    }
  },

  afterModel(model) {
    if(model.schemaDocument && model.attestation) {
      model.schemaDocument.load(model.attestation.get('document'));
    }
  },

  actions: {
    onPrevious() {
      let profile = this.modelFor('setup');

      profile.previous(this.get('stepName'));
      profile.save();

      this.transitionTo(`setup.${profile.get('currentStep')}`);
    },

    onNext() {
      let profile = this.modelFor('setup');

      profile.next(this.get('stepName'));
      profile.save();

      this.transitionTo(`setup.${profile.get('currentStep')}`);
    }
  }
});
