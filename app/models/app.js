import DS from 'ember-data';
import Ember from 'ember';
import ProvisionableMixin from '../mixins/models/provisionable';

export default DS.Model.extend(ProvisionableMixin, {
  // properties
  handle: DS.attr('string'),
  gitRepo: DS.attr('string'),
  createdAt: DS.attr('iso-8601-timestamp'),

  reloadOn: ['deprovisioning'],

  // relationships
  stack: DS.belongsTo('stack', {async: true}),
  services: DS.hasMany('service', {async:true}),
  operations: DS.hasMany('operation', {async:true}),
  vhosts: DS.hasMany('vhost', {async:true}),
  lastOperation: DS.belongsTo('operation', {async:true}),
  lastDeployOperation: DS.belongsTo('operation', {async:true}),
  currentImage: DS.belongsTo('image', {async:true}),

  serviceUsage: Ember.computed.mapBy('services', 'usage'),
  usage: Ember.computed.sum('serviceUsage')
});
