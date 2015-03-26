import DS from 'ember-data';

export default DS.Model.extend({
  scope: DS.attr('string'),
  roleUrl: DS.attr('string'),

  role: DS.belongsTo('role', {async:true}),
  stack: DS.belongsTo('stack', {async:true})
});
