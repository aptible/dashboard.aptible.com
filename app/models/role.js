import DS from 'ember-data';

export default DS.Model.extend({
  name: DS.attr(),
  privileged: DS.attr('boolean'),
  organization: DS.belongsTo('organization', {async: true}),
  memberships: DS.hasMany('membership', {async:true}),
  invitations: DS.hasMany('invitations', {async:true}),
  users: DS.hasMany('users', {async:true})
});
