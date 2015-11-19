import Ember from 'ember';

export const DATA_ENVIRONMENTS = [
  { name: 'Aptible PaaS', provider: 'aptible', handle: 'aptible', selected: true },
  { name: 'Amazon EC2', provider: 'aws', handle: 'ec2', selected: false },
  { name: 'Amazon S3', provider: 'aws', handle: 's3', selected: false },
  { name: 'Amazon EBS', provider: 'aws', handle: 'ebs', selected: false },
  { name: 'Amazon ELB', provider: 'aws', handle: 'elb', selected: false },
  { name: 'Amazon Redshift', provider: 'aws', handle: 'redshift', selected: false },
  { name: 'Amazon Glacier', provider: 'aws', handle: 'glacier', selected: false },
  { name: 'Google Calendar', provider: 'google', handle: 'google-calendar', selected: false },
  { name: 'Google Drive', provider: 'google', handle: 'google-drive', selected: false },
  { name: 'Gmail', provider: 'google', handle: 'gmail', selected: false },
  { name: 'Vault', provider: 'google', handle: 'google-vault', selected: false },
  { name: 'On-premise applicance', provider: false, handle: 'on-premise', selected: false },
  { name: 'Laptops', provider: false, handle: 'laptops', selected: false },
  { name: 'Workstations', provider: false, handle: 'workstations', selected: false },
  { name: 'Paper', provider: false, handle: 'paper', selected: false },
  { name: 'Portable media(USB drives)', provider: false, handle: 'usb', selected: false },
  { name: 'Portable devices(phone or tablet)', provider: false, handle: 'phone', selected: false }
];

export default Ember.Route.extend({
  model() {
    let dataEnvironments = DATA_ENVIRONMENTS.map((de) => Ember.Object.create(de));
    let attestation = this.store.createRecord('attestation', { handle: 'selected-data-environments' });

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
