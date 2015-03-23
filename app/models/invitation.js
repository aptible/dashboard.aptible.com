import DS from 'ember-data';

export default DS.Model.extend({
  email: DS.attr('string'),
  createdAt: DS.attr('date'),
  updatedAt: DS.attr('date'),

  role: DS.belongsTo('role', {async:true})
});
