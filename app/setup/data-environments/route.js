import Ember from 'ember';
import Schema from 'ember-json-schema/models/schema';
import Property from 'ember-json-schema/models/property';
import locationsSchema from 'sheriff/schemas/locations';

export const DATA_ENVIRONMENTS = [
  { name: 'Aptible PaaS', provider: 'aptible', handle: 'aptible', selected: true },
  { name: 'EC2', provider: 'aws', handle: 'ec2', selected: false },
  { name: 'S3', provider: 'aws', handle: 's3', selected: false },
  { name: 'EBS', provider: 'aws', handle: 'ebs', selected: false },
  { name: 'ELB', provider: 'aws', handle: 'elb', selected: false },
  { name: 'Redshift', provider: 'aws', handle: 'redshift', selected: false },
  { name: 'Glacier', provider: 'aws', handle: 'glacier', selected: false },
  { name: 'Google Docs', provider: 'google', handle: 'google-docs', selected: false },
  { name: 'Google Drive', provider: 'google', handle: 'google-drive', selected: false },
  { name: 'GMail', provider: 'google', handle: 'gmail', selected: false },
  { name: 'On-premise applicance', provider: false, handle: 'on-premise', selected: false },
  { name: 'Laptops', provider: false, handle: 'laptops', selected: false },
  { name: 'Workstations', provider: false, handle: 'workstations', selected: false },
  { name: 'Paper', provider: false, handle: 'paper', selected: false },
  { name: 'Portable media(USB drives)', provider: false, handle: 'usb', selected: false },
  { name: 'Portable devices(phone or tablet)', provider: false, handle: 'phone', selected: false }
];

export default Ember.Route.extend({
  model() {
    return DATA_ENVIRONMENTS.map((de) => Ember.Object.create(de));
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
      let { schemaDocument, attestation } = this.currentModel;
      let profile = this.modelFor('setup');
      let selectedDataEnvironments = this.currentModel.filterBy('selected');

      profile.set('selectedDataEnvironments', selectedDataEnvironments);
      profile.next();

      profile.save().then(() => {
        this.transitionTo(`setup.${profile.get('currentStep')}`);
      });
    }
  }
});
