import DS from 'ember-data';
import Ember from 'ember';

var STATUSES = {
  DEPROVISIONED: 'deprovisioned',
  PROVISIONED:   'provisioned'
};

var App = DS.Model.extend({
  handle: DS.attr('string'),
  gitRepo: DS.attr('string'),
  status: DS.attr('string', {defaultValue: STATUSES.PROVISIONED}),
  stack: DS.belongsTo('stack', {async: true}),
  services: DS.hasMany('service', {async:true}),

  isDeprovisioned: Ember.computed.equal('status', STATUSES.DEPROVISIONED)
});

export default App;
