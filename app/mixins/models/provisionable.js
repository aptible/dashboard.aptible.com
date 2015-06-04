import Ember from 'ember';

const STATUSES = {
  PENDING:        'pending',
  PROVISIONING:   'provisioning',
  DEPROVISIONED:  'deprovisioned',
  PROVISIONED:    'provisioned',
  DEPROVISIONING: 'deprovisioning'
};

export default Ember.Mixin.create({
  status: DS.attr('string', {defaultValue: STATUSES.PENDING}),
  isDeprovisioned: Ember.computed.equal('status', STATUSES.DEPROVISIONED),
  isDeprovisioning: Ember.computed.equal('status', STATUSES.DEPROVISIONING),
  isProvisioned: Ember.computed.equal('status', STATUSES.PROVISIONED),
  isProvisioning: Ember.computed.equal('status', STATUSES.PROVISIONING),
  isPending: Ember.computed.equal('status', STATUSES.PENDING),
  hasBeenDeprovisioned: Ember.computed.or('isDeprovisioned', 'isDeprovisioning'),
  hasBeenDeployed: Ember.computed.not('isPending')
});
