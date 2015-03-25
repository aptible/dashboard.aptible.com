import DS from 'ember-data';

export default DS.Model.extend({
  email: DS.attr('string'),
  createdAt: DS.attr('date'),
  updatedAt: DS.attr('date'),

  role: DS.belongsTo('role', {async:true}),

  // This relationship is necessary to populate the
  // inverse relationship organization#hasMany('invitations'),
  // so that creating a new invitation for an organization
  // causes it to show up in the UI.
  // This relationship is not surfaced directly in the Auth API
  organization: DS.belongsTo('organization', {async:true})
});
