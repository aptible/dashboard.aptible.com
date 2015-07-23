import DS from 'ember-data';
import Ember from 'ember';

export default DS.Model.extend({
  // properties
  body: DS.attr('string'),
  privateKey: DS.attr('string'),
  commonName: DS.attr('string'),
  createdAt: DS.attr('iso-8601-timestamp'),

  // relationships
  stack: DS.belongsTo('stack', {async: true}),
  operations: DS.hasMany('operation', {async:true}),
  vhosts: DS.hasMany('vhost', {async:true}),

  inUse: Ember.computed.gt('vhosts.length', 0),
  name: Ember.computed.reads('commonName')
});
