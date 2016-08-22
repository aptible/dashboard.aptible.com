import DS from 'ember-data';

export default DS.Model.extend({
  release: DS.belongsTo('release', {async:true}),
  dockerName: DS.attr('string'),
  layer: DS.attr('string'),
  memoryLimit: DS.attr('number')
});

