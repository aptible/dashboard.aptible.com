import Ember from 'ember';

export const DATA_ENVIRONMENTS = [
  { name: 'Aptible PaaS', provider: 'aptible', handle: 'aptible', selected: true },
  { name: 'Amazon S3', provider: 'aws', handle: 's3', selected: false },
  { name: 'Google Calendar', provider: 'google', handle: 'google-calendar', selected: false },
  { name: 'Google Drive', provider: 'google', handle: 'google-drive', selected: false },
  { name: 'Gmail', provider: 'google', handle: 'gmail', selected: false },
  { name: 'Mailgun', provider: 'mailgun', handle: 'mailgun', selected: false }
];

export default Ember.Route.extend({
  model() {
    let dataEnvironments = DATA_ENVIRONMENTS.map((de) => Ember.Object.create(de));
    let organization = this.modelFor('organization');
    let attestation = this.store.createRecord('attestation', {
      handle: 'selected-data-environments',
      organization: organization.get('data.links.self')
    });

    return { dataEnvironments, attestation};
  },

  setupController(controller, model) {
    controller.set('model', model.dataEnvironments);
    controller.set('attestation', model.attestation);
  },

  afterModel() {
    let profile = this.modelFor('setup');

    if(!profile.isReadyForStep('data-environments')) {
      return this.transitionTo(`setup.${profile.get('currentStep')}`);
    }
  },

  actions: {
    onPrevious() {
      let profile = this.modelFor('setup');

      profile.previous();
      profile.save().then(() => {
        let previousPath = `setup.${profile.get('currentStep')}`;
        this.transitionTo(previousPath);
      });
    },

    onNext() {
      let { attestation, dataEnvironments } = this.currentModel;
      let profile = this.modelFor('setup');
      let selectedDataEnvironments = dataEnvironments.filterBy('selected');

      profile.setProperties({ selectedDataEnvironments });
      attestation.set('document', selectedDataEnvironments);
      attestation.save().then(() => {
        profile.next();
        profile.save().then(() => {
          this.transitionTo(`setup.${profile.get('currentStep')}`);
        });
      });
    }
  }
});
