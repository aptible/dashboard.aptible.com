import DS from 'ember-data';

export default DS.Model.extend({
  app: DS.belongsTo('app', {async:true}),
  handle: DS.attr('string'),
  containerCount: DS.attr('number'),
  vhosts: DS.hasMany('vhost', {async:true})
});
