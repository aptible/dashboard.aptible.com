import Ember from 'ember';

export default Ember.Mixin.create({
  stepName: Ember.computed('routeName', function() {
    return this.get('routeName').split('.').get('lastObject');
  }),

  beforeModel() {
    let profile = this.modelFor('setup');
    let currentStep = profile.get('currentStep') || 'start';

    if(!profile.isReadyForStep(this.get('stepName'))) {
      return this.transitionTo(`setup.${currentStep}`);
    }
  },

  afterModel(model) {
    if(model.schemaDocument && model.attestation) {
      model.schemaDocument.load(model.attestation.get('document'));
    }

    this.modelFor('setup').set('loading', false);
  },

  next() {
    let profile = this.modelFor('setup');

    profile.next(this.get('stepName'));
    profile.save().catch((e) => {
      let message = Ember.getWithDefault(e, 'responseJSON.message', 'An error occured');
      Ember.get(this, 'flashMessages').danger(`Save Failed! ${message}`);
    });

    this.transitionTo(`setup.${profile.get('currentStep')}`);
  },

  previous() {
    let profile = this.modelFor('setup');

    profile.previous(this.get('stepName'));
    profile.save().catch((e) => {
      let message = Ember.getWithDefault(e, 'responseJSON.message', 'An error occured');
      Ember.get(this, 'flashMessages').danger(`Save Failed! ${message}`);
    });

    this.transitionTo(`setup.${profile.get('currentStep')}`);
  },

  finish() {
    let profile = this.modelFor('setup');
    profile.setProperties({ hasCompletedSetup: true, currentStep: 'finish' });

    profile.save().catch((e) => {
      let message = Ember.getWithDefault(e, 'responseJSON.message', 'An error occured');
      Ember.get(this, 'flashMessages').danger(`Save Failed! ${message}`);
    });

    this.transitionTo('setup.finish');
  },

  save() {
    let { schemaDocument, attestation } = this.currentModel;
    attestation.set('document', schemaDocument.dump({ excludeInvalid: true }));

    attestation.save().then(() => {
      let message = 'Progress saved.';
      Ember.get(this, 'flashMessages').success(message);
    }, (e) => {
      let message = Ember.getWithDefault(e, 'responseJSON.message', 'An error occured');
      Ember.get(this, 'flashMessages').danger(`Save Failed! ${message}`);
    });
  },

  actions: {
    loading() {
      // Prevent transitions to loading sub state and instead let setup know.
      //this.modelFor('setup').set('loading', true);
      return false;
    },

    onSave() {
      this.save();
    },

    onPrevious() {
      this.previous();
    },

    onNext() {
      this.next();
    }
  }
});
