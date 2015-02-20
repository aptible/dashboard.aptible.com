import DS from 'ember-data';
import Ember from 'ember';

export default DS.Model.extend({
  name: DS.attr('string'),
  handle: DS.attr('string'),
  connectionUrl: DS.attr('string'),
  type: DS.attr('string'), // postgresql, redis, etc.
  createdAt: DS.attr('iso-8601-timestamp'),

  // relationships
  stack: DS.belongsTo('stack', {async: true}),
  operations: DS.hasMany('operation', {async:true})
});

export function provisionDatabases(user, store){
  if (!user.get('verified')) { return Ember.RSVP.resolve(); }

  return store.find('database').then( function(databases) {
    let promises = databases.map(function(database){
      let op = store.createRecord('operation', {
        type: 'provision',
        diskSize: '10', // FIXME
        database: database
      });
      return op.save();
    });

    return Ember.RSVP.all(promises);
  });
}
