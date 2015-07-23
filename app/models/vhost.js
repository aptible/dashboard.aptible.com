import DS from 'ember-data';
import ProvisionableMixin from '../mixins/models/provisionable';

export default DS.Model.extend(ProvisionableMixin, {
  externalHost: DS.attr('string'),
  privateKey: DS.attr('string'),
  certificateBody: DS.attr('string'),
  type: DS.attr('string', {defaultValue:'http_proxy_protocol'}),
  isDefault: DS.attr('boolean'),
  internal: DS.attr('boolean', {defaultValue: false}),

  certificate: DS.belongsTo('certificate', { async: true }),
  service: DS.belongsTo('service', {async:true}),
  app: DS.belongsTo('app', { async: true }),
  operations: DS.hasMany('operation', {async:true}),

  reloadWhileProvisioning: true,

  virtualDomain: DS.attr('string'),
  commonName: Ember.computed('certificate.commonName', 'virtualDomain', function() {
    return this.get('certificate.commonName') || this.get('virtualDomain')
  }),
  displayHost: Ember.computed('isDefault', 'externalHost', 'virtualDomain', function() {
    if(this.get('isDefault')) {
      return this.get('virtualDomain');
    }

    return this.get('externalHost');
  })
});
