import DS from 'ember-data';

export default DS.Model.extend({
  name: DS.attr('string'),
  handle: DS.attr('string'),
  stack: DS.belongsTo('stack', {async: true}),
  operations: DS.hasMany('operation', {async:true})
});
