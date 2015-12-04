import Ember from 'ember';
import SPDRouteMixin from 'sheriff/mixins/routes/spd-route';

export const DATA_ENVIRONMENTS = [
  { name: 'Aptible PaaS', provider: 'aptible', handle: 'aptible', selected: true },
  { name: 'Amazon S3', provider: 'aws', handle: 's3', selected: false },
  { name: 'Google Calendar', provider: 'google', handle: 'google-calendar', selected: false },
  { name: 'Google Drive', provider: 'google', handle: 'google-drive', selected: false },
  { name: 'Gmail', provider: 'google', handle: 'gmail', selected: false },
  { name: 'Mailgun', provider: 'mailgun', handle: 'mailgun', selected: false }
];

export default Ember.Route.extend(SPDRouteMixin, {
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

  actions: {
    onNext() {
      let { attestation, dataEnvironments } = this.currentModel;
      let profile = this.modelFor('setup');
      let selectedDataEnvironments = dataEnvironments.filterBy('selected');

      profile.setProperties({ selectedDataEnvironments });
      attestation.set('document', selectedDataEnvironments);
      attestation.save().then(() => {
        profile.next(this.get('stepName'));
        profile.save().then(() => {
          this.transitionTo(`setup.${profile.get('currentStep')}`);
        });
      });
    }
  }
});
