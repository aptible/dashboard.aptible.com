import Ember from "ember";

export default Ember.Controller.extend({
  invitedUser: null,

  nonmembers: Ember.computed('role.users.[]', 'authorizationContext.users.[]', function() {
    const members = this.get('role.users');
    const organizationUsers = this.get('authorizationContext.users');
    return organizationUsers.reject((user) => {
      return members.contains(user);
    });
  })
});
