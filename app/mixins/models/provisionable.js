import Ember from 'ember';
import DS from 'ember-data';

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
      isDestroying,
      isDestroyed
    } = this.getProperties('status', 'isDestroying', 'isDestroyed');
    let inReloadStatus = this.get('reloadOn').indexOf(status) > -1;
    let currentState = this.get('currentState.stateName');
    let inLoadedState = currentState !== 'root.empty' && currentState !== 'root.deleted.uncommitted';

    return inLoadedState && inReloadStatus && !isDestroyed && !isDestroying;
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
      // Believe it or not, this console.log has to currently be here. This is a textbook
      // definition of a heisenbug. After adding the err.status check, if I had not added a
      // console.log or a window.alert before this check, the model would immediately remove
      // itself from the UI. If something wrong occurs, then the model reappears. Until someone
      // figures out why that is, the console.log stays.
      console.log(err);
      if (404 === err.status || err.message && err.message.indexOf('notFound') > -1) {
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
