import DS from 'ember-data';
import Ember from 'ember';
import ProvisionableMixin from '../mixins/models/provisionable';
import STATUSES from '../mixins/models/statuses';

export default DS.Model.extend(ProvisionableMixin, {
  handle: DS.attr('string'),
  drainHost: DS.attr('string'),
  drainPort: DS.attr('string'),
  drainType: DS.attr('string'),
  drainUsername: DS.attr('string'),
  drainPassword: DS.attr('string'),
  reloadOn: [STATUSES.PENDING, STATUSES.PROVISIONING, STATUSES.DEPROVISIONING],

  stack: DS.belongsTo('stack', {async:true}),

  isLogTail: Ember.computed.equal('drainType', 'tail')
});
