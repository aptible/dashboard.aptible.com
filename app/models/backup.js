import DS from 'ember-data';

export default DS.Model.extend({
  awsRegion: DS.attr('string'),
  createdAt: DS.attr('iso-8601-timestamp'),

  stack: DS.belongsTo('stack', {async: true}),
  database: DS.belongsTo('database', {async: true}),
  copiedFrom: DS.belongsTo('backup', {embedded: true, inverse: 'copies'}),
  copies: DS.hasMany('backup', {async: true, inverse: 'copiedFrom'})
});
