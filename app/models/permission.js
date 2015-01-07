import DS from 'ember-data';

export default DS.Model.extend({
  scope: DS.attr('string'),

  role: DS.belongsTo('role', {async:true})
});
