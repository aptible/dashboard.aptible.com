import Ember from 'ember';
import DS from 'ember-data';

export let RELOAD_RETRY_DELAY = 30000;

export const STATUSES = {
  PENDING:        'pending',
  PROVISIONING:   'provisioning',
  DEPROVISIONED:  'deprovisioned',
  PROVISIONED:    'provisioned',
  DEPROVISIONING: 'deprovisioning'
};

const ReloadStatuses = [
  STATUSES.PROVISIONING,
  STATUSES.DEPROVISIONING
];

const {
  observer,
  computed,
  run,
  on
} = Ember;

export const ProvisionableBaseMixin = Ember.Mixin.create({
  _reloadRetryDelay: RELOAD_RETRY_DELAY,
  _shouldReload: function() {
    let {
      status,
      reloadWhileProvisioning
    } = this.getProperties('status', 'reloadWhileProvisioning');

    return reloadWhileProvisioning && ReloadStatuses.indexOf(status) > -1;
  },

  // we should refactor this away from using observers once
  // we update to Ember Data 1.13 (where we can use the `shouldBackgroundRefresh`
  // hooks)
  _recursiveReload: observer('status', on('init', function() {
    if (!this._shouldReload()) { return; }

    this.reload().then(() => {
      run.later(this, this._recursiveReload, this._reloadRetryDelay);
    });
  })),

  isDeprovisioned: computed.equal('status', STATUSES.DEPROVISIONED),
  isDeprovisioning: computed.equal('status', STATUSES.DEPROVISIONING),
  isProvisioned: computed.equal('status', STATUSES.PROVISIONED),
  isProvisioning: computed.equal('status', STATUSES.PROVISIONING),
  isPending: computed.equal('status', STATUSES.PENDING),
  hasBeenDeprovisioned: computed.or('isDeprovisioned', 'isDeprovisioning'),
  hasBeenDeployed: computed.not('isPending')
});

export default Ember.Mixin.create({
  status: DS.attr('string', {defaultValue: STATUSES.PENDING})
}, ProvisionableBaseMixin);
