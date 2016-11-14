import DS from 'ember-data';

export default DS.Model.extend({
  user: DS.belongsTo('user', { async: true }),
  email: DS.attr('string'),
  createdAt: DS.attr('date'),
  expiresAt: DS.attr('date'),
});
