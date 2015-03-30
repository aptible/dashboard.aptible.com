import DS from 'ember-data';

export default DS.Model.extend({
  userUrl: DS.attr(),
  user: DS.belongsTo('user', {async: true}),
  role: DS.belongsTo('role', {async: true})
});
