import Ember from 'ember';
import DS from 'ember-data';

function doesPermissionsIncludeRole(permissions, role) {
  let roleHref = role.get('data.links.self');
  let permissionRoles = permissions.map((p) => p.get('data.links.role'));

  return permissionRoles.indexOf(roleHref) > -1;
}

export default Ember.Mixin.create({
  managePermissions: Ember.computed.filterBy('permissions', 'scope', 'manage'),

  developmentUsers: Ember.computed('organizationDevelopmentRoles', function() {
    let developmentRoles = this.get('organizationDevelopmentRoles');
    let developmentUsersPromise = new Ember.RSVP.Promise((resolve) => {

      // Load all users for each development role
      Ember.RSVP.all(developmentRoles.map((r) => r.get('users'))).then(() => {

        // Once all users are loaded, loop through each user and add to
        // list of development users
        if (this.get('isDestroyed')) {
          return;
        }

        let developmentUsers = [];
        developmentRoles.forEach((r) => {
          r.get('users').forEach((u) => {
            developmentUsers.addObject(u);
          });
        });

        // resolve collection of development users
        resolve(developmentUsers);
      });
    });

    return DS.PromiseArray.create({
      promise: developmentUsersPromise
    });
  }),

  organizationDevelopmentRoles: Ember.computed('organization.roles.[]', 'managePermissions.[]', function() {
    let managePermissions = this.get('managePermissions');

    return this.get('organization.roles').filter((role) => {
      return role.get('privileged') || doesPermissionsIncludeRole(managePermissions, role);
    });
  })
});
