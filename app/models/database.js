import DS from 'ember-data';

export default DS.Model.extend({
  name: DS.attr('string'),
  handle: DS.attr('string'),
  connectionUrl: DS.attr('string'),
  stack: DS.belongsTo('stack', {async: true}),
  type: DS.attr('string'), // postgresql, redis, etc.
  operations: DS.hasMany('operation', {async:true})
});
