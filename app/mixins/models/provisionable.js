import Ember from 'ember';
import DS from 'ember-data';

export let SHOULD_RELOAD = true;

export function SET_SHOULD_RELOAD(bool) {
  SHOULD_RELOAD = bool;
}

export let RELOAD_RETRY_DELAY = 30000;

export const STATUSES = {
  PENDING:              'pending',
  PROVISIONING:         'provisioning',
  DEPROVISIONED:        'deprovisioned',
  PROVISIONED:          'provisioned',
  DEPROVISIONING:       'deprovisioning',
  PROVISION_FAILED:     'provision_failed',
  DEPROVISION_FAILED:   'deprovision_failed'
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
      reloadWhileProvisioning,
      isDestroying,
      isDestroyed
    } = this.getProperties('status', 'reloadWhileProvisioning', 'isDestroying', 'isDestroyed');
    let inReloadStatus = ReloadStatuses.indexOf(status) > -1;

    return SHOULD_RELOAD && reloadWhileProvisioning && inReloadStatus && !isDestroyed && !isDestroying;
  },

  // we should refactor this away from using observers once
  // we update to Ember Data 1.13 (where we can use the `shouldBackgroundRefresh`
  // hooks)
  _recursiveReload: observer('status', on('init', function() {
    if (!this._shouldReload()) { return; }

    this.reload().then(() => {
      setTimeout(() => {
        run(this, '_recursiveReload');
      }, this._reloadRetryDelay);
    }).catch((err) => {
      if(err.message.indexOf('notFound') > -1) {
        this.deleteRecord();
        return;
      }

      throw err;
    });
  })),

  isDeprovisioned: computed.equal('status', STATUSES.DEPROVISIONED),
  isDeprovisioning: computed.equal('status', STATUSES.DEPROVISIONING),
  isProvisioned: computed.equal('status', STATUSES.PROVISIONED),
  isProvisioning: computed.equal('status', STATUSES.PROVISIONING),
  hasFailedProvision: computed.equal('status', STATUSES.PROVISION_FAILED),
  hasFailedDeprovision: computed.equal('status', STATUSES.DEPROVISION_FAILED),
  isPending: computed.equal('status', STATUSES.PENDING),
  hasBeenDeprovisioned: computed.or('isDeprovisioned', 'isDeprovisioning'),
  hasBeenDeployed: computed.not('isPending')
});

export default Ember.Mixin.create({
  status: DS.attr('string', {defaultValue: STATUSES.PENDING})
}, ProvisionableBaseMixin);
