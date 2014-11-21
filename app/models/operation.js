import DS from 'ember-data';

export default DS.Model.extend({
  app: DS.belongsTo('app', {async:true}),

  type: DS.attr('string'),
  status: DS.attr('string'),
  createdAt: DS.attr('string'),
  userName: DS.attr('string'),
  userEmail: DS.attr('string')
});
