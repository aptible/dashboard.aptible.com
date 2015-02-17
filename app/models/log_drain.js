import DS from 'ember-data';

export default DS.Model.extend({
  handle: DS.attr('string'),
  drainHost: DS.attr('string'),
  drainPort: DS.attr('string'),

  stack: DS.belongsTo('stack', {async:true})
});
