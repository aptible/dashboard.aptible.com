import Ember from 'ember';

export default Ember.Route.extend({
  model() {
    let organization = this.modelFor('organization');
    let store = this.store;

    return new Ember.RSVP.Promise(function(resolve) {
      store.find('organization-profile', organization.get('id'))
        .then((profile) => { resolve(profile); })
        .catch(() => {
          let newProfile = store.createRecord('organization-profile', { id: organization.get('id') });
          resolve(newProfile);
        });
    });
  },

  afterModel() {
    let profile = this.modelFor('setup');
    let currentStep = profile.get('currentStep');

    if(currentStep !== 'organization') {
      return this.transitionTo(`setup.${currentStep}`);
    }
  }
});
