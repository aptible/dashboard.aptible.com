import DS from 'ember-data';
import Ember from 'ember';
import ProvisionableMixin from '../mixins/models/provisionable';
import { STATUSES, SHOULD_RELOAD } from '../mixins/models/provisionable';

let ReloadStatuses = [
  STATUSES.PENDING, STATUSES.PROVISIONING, STATUSES.DEPROVISIONING
];

export default DS.Model.extend(ProvisionableMixin, {
  handle: DS.attr('string'),
  drainHost: DS.attr('string'),
  drainPort: DS.attr('string'),
  drainType: DS.attr('string'),
  drainUsername: DS.attr('string'),
  drainPassword: DS.attr('string'),

  stack: DS.belongsTo('stack', {async:true}),

  reloadWhileProvisioning: true,

  isLogTail: Ember.computed.equal('drainType', 'tail'),
  _shouldReload() {
    let {
      status,
      reloadWhileProvisioning,
      isDestroying,
      isDestroyed
    } = this.getProperties('status', 'reloadWhileProvisioning', 'isDestroying', 'isDestroyed');
    let inReloadStatus = ReloadStatuses.indexOf(status) > -1;

    let currentState = this.get('currentState.stateName');
    let inLoadedState = currentState !== 'root.empty' && currentState !== 'root.deleted.uncommitted';

    return SHOULD_RELOAD && inLoadedState && reloadWhileProvisioning && inReloadStatus && !isDestroyed && !isDestroying;
  },
});
