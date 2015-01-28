import DS from 'ember-data';
import Ember from 'ember';

var STATUSES = {
  DEPROVISIONED:  'deprovisioned',
  PROVISIONED:    'provisioned',
  DEPROVISIONING: 'deprovisioning'
};

export default DS.Model.extend({
  handle: DS.attr('string'),
  gitRepo: DS.attr('string'),
  status: DS.attr('string', {defaultValue: STATUSES.PROVISIONED}),
  stack: DS.belongsTo('stack', {async: true}),
  services: DS.hasMany('service', {async:true}),
  operations: DS.hasMany('operation', {async:true}),
  vhosts: DS.hasMany('vhost', {async:true}),

  isDeprovisioned: Ember.computed.equal('status', STATUSES.DEPROVISIONED)
});
