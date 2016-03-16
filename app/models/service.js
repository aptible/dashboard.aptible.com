import DS from 'ember-data';

export default DS.Model.extend({
  vhosts: DS.hasMany('vhost', {async:true}),
  stack: DS.belongsTo('stack', {async:true}),
  app: DS.belongsTo('app', {async:true}),

  handle: DS.attr('string'),
  command: DS.attr('string'),
  containerCount: DS.attr('number'),
  containerMemoryLimitMb: DS.attr('number'),
  processType: DS.attr('string'),

  currentRelease: DS.belongsTo('release', {async:true}),

  containerSize: Ember.computed('containerMemoryLimitMb', function() {
    return this.get('containerMemoryLimitMb') || 1024;
  })
});
