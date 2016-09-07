import Ember from "ember";
import DS from 'ember-data';
import ProvisionableMixin from '../mixins/models/provisionable';

export default DS.Model.extend(ProvisionableMixin, {
  externalHost: DS.attr('string'),
  privateKey: DS.attr('string'),
  certificateBody: DS.attr('string'),
  type: DS.attr('string', {defaultValue:'http_proxy_protocol'}),
  isDefault: DS.attr('boolean'),
  internal: DS.attr('boolean', {defaultValue: false}),
  virtualDomain: DS.attr('string'),
  userDomain: DS.attr('string'),
  isAcme: DS.attr('boolean', { defaultValue: false }),
  acmeStatus: DS.attr('string'),

  certificate: DS.belongsTo('certificate', { async: true }),
  service: DS.belongsTo('service', {async:true}),
  app: DS.belongsTo('app', { async: true }),
  operations: DS.hasMany('operation', {async:true}),

  useCertificate: true,

  reloadOn: ['provisioning', 'deprovisioning'],

  commonName: Ember.computed.alias('virtualDomain'),

  displayHost: Ember.computed('isDefault', 'externalHost', 'virtualDomain', function() {
    if (this.get('isDefault')) {
      return this.get('virtualDomain');
    }
    return this.get('externalHost');
  }),

  isGeneric: Ember.computed("isDefault", "isAcme", function() {
    return !(this.get("isDefault") || this.get("isAcme"));
  }),

  acmeIsPending: Ember.computed.equal("acmeStatus", "pending"),
  acmeIsTransitioning: Ember.computed.equal("acmeStatus", "transitioning"),
  acmeIsReady: Ember.computed.equal("acmeStatus", "ready"),

  acmeActivationRequired: Ember.computed('isProvisioned', 'isAcme', 'acmeIsReady', function() {
    if (!this.get('isProvisioned')) { return false; }
    if (!this.get('isAcme')) { return false; }
    return !this.get("acmeIsReady");
  }),

  actionsRequired: Ember.computed('acmeActivationRequired', function() {
    const actions = [];
    if (this.get('acmeActivationRequired')) { actions.push('acme'); }
    return actions;
  }),

  hasActionRequired: Ember.computed.gt('actionsRequired.length', 0)
});
