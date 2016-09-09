import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['aptable__member-row'],
  tagName: 'tr',

  organizationRoles: Ember.computed('user.roles.[]', 'organization', function() {
    let organizationHref = this.get('organization.data.links.self');
    return this.get('user.roles')
               .filterBy('data.links.organization', organizationHref)
               .sortBy('name');
  }),

  csvLastIndex: Ember.computed('organizationRoles.[]', function() {
    return this.get('organizationRoles.length') - 1;
  })
});

