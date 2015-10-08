import Ember from 'ember';

export const DATA_ENVIRONMENTS = [
  { name: 'Aptible PaaS', provider: 'aptible', selected: true },
  { name: 'EC2', provider: 'aws', selected: true },
  { name: 'S3', provider: 'aws', selected: false },
  { name: 'EBS', provider: 'aws', selected: false },
  { name: 'ELB', provider: 'aws', selected: false },
  { name: 'Redshift', provider: 'aws', selected: false },
  { name: 'Glacier', provider: 'aws', selected: false },
  { name: 'Google Docs', provider: 'google', selected: false },
  { name: 'Google Drive', provider: 'google', selected: false },
  { name: 'GMail', provider: 'google', selected: false },
  { name: 'On-premise applicance', provider: false, selected: false },
  { name: 'Laptops', provider: false, selected: false },
  { name: 'Workstations', provider: false, selected: false },
  { name: 'Paper', provider: false, selected: false },
  { name: 'Portable media(USB drives)', provider: false, selected: false },
  { name: 'Portable devices(phone or tablet)', provider: false, selected: false },
];

export default Ember.Component.extend({
 classNames: ['data-environment-index'],
 dataEnvironments: DATA_ENVIRONMENTS
});
