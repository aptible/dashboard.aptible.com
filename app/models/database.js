import DS from 'ember-data';
import Ember from 'ember';
import ProvisionableMixin from '../mixins/models/provisionable';

export default DS.Model.extend(ProvisionableMixin, {
  name: DS.attr('string'),
  handle: DS.attr('string'),
  connectionUrl: DS.attr('string'),
  type: DS.attr('string', { defaultValue: 'postgresql'}), // postgresql, redis, etc.
  createdAt: DS.attr('iso-8601-timestamp'),
  initialDiskSize: DS.attr('number'),

  // relationships
  stack: DS.belongsTo('stack', {async: true}),
  operations: DS.hasMany('operation', {async:true}),
  disk: DS.belongsTo('disk', {async:true}),
  databaseImage: DS.belongsTo('database-image', {async: true}),
  initializeFrom: DS.belongsTo('database', {async: true, inverse: 'dependents'}),
  dependents: DS.hasMany('database', {async: true, inverse: 'initializeFrom'}),
  service: DS.belongsTo('service', {async:true}),
  backups: DS.hasMany('backups', {async: true}),

  reloadWhileProvisioning: true,

  supportsReplication: Ember.computed('type', function () {
    let type = this.get('type');
    return (type === 'redis' ||
            type === 'postgresql' ||
            type === 'mysql');
  }),

  supportsClustering: Ember.computed.equal('type', 'mongodb'),

  serviceUsage: Ember.computed.mapBy('service', 'usage'),
  usage: Ember.computed.sum('serviceUsage')
});

export function provisionDatabases(user, store){
  if (!user.get('verified')) { return Ember.RSVP.resolve(); }

  return store.find('database').then( function(databases) {
    let promises = databases.map(function(database){
      if(!database.get('isPending')) {
        return Ember.RSVP.resolve();
      }

      let op = store.createRecord('operation', {
        type: 'provision',
        diskSize: database.get('initialDiskSize') || '10',
        database: database
      });
      return op.save();
    });

    return Ember.RSVP.all(promises);
  });
}
