import Ember from 'ember';
import DS from 'ember-data';

export default DS.Model.extend({
  vhosts: DS.hasMany('vhost', {async:true}),
  stack: DS.belongsTo('stack', {async:true}),
  app: DS.belongsTo('app', {async:true}),
  database: DS.belongsTo('database', {async:true}),

  handle: DS.attr('string'),
  command: DS.attr('string'),
  containerCount: DS.attr('number'),
  containerMemoryLimitMb: DS.attr('number'),
  processType: DS.attr('string'),

  currentRelease: DS.belongsTo('release', {async:true}),
  inService: Ember.computed.gt('containerCount', 0),
  containerSize: Ember.computed('containerMemoryLimitMb', function() {
    return this.get('containerMemoryLimitMb') || 1024;
  }),

  containerSizeGB: Ember.computed('containerMemoryLimitMb', function() {
    return this.get('containerSize') / 1024;
  }),

  usage: Ember.computed('containerCount', 'containerSize', function() {
    return this.get('containerCount') * (this.get('containerSize') / 1024);
  }),

  name: Ember.computed('processType', 'command', function() {
    return `${this.get('processType')} - ${this.get('command')}`;
  })
});
