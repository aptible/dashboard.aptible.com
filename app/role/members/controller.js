import Ember from "ember";

export default Ember.Controller.extend({
  sortBy: ['user.name:asc'],
  filterValue: '',

  sortedMemberships: Ember.computed.sort('model', 'sortBy'),

  nonmembers: Ember.computed('role.users.[]', 'organization.users.[]', function() {
    const members = this.get('role.users');
    const organizationUsers = this.get('organization.users');
    return organizationUsers.reject((user) => {
      return members.contains(user);
    });
  })
});
