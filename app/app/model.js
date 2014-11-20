import DS from 'ember-data';

export default DS.Model.extend({
  handle: DS.attr('string'),
  gitRepo: DS.attr('string'),
  status: DS.attr('string'),
  stack: DS.belongsTo('stack', {async: true})
});
