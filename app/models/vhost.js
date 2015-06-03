import DS from 'ember-data';
import ProvisionableMixin from '../mixins/models/provisionable';

export default DS.Model.extend(ProvisionableMixin, {
  virtualDomain: DS.attr('string'),
  externalHost: DS.attr('string'),
  privateKey: DS.attr('string'),
  certificate: DS.attr('string'),
  type: DS.attr('string', {defaultValue:'http'}),
  isDefault: DS.attr('boolean'),
  internal: DS.attr('boolean'),
  service: DS.belongsTo('service', {async:true}),
  app: DS.belongsTo('app', { async: true }),
  isProvisioned: Ember.computed.equal('status', 'provisioned'),
  displayHost: Ember.computed('isDefault', 'externalHost', 'virtualDomain', function() {
    if(this.get('isDefault')) {
      return this.get('virtualDomain');
    }

    return this.get('externalHost');
  })
});
