import DS from 'ember-data';

export default DS.Model.extend({
  containers: DS.hasMany('container', {async:true}),
  service: DS.belongsTo('service', {async:true})
});
