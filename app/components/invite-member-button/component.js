import Ember from 'ember';

export default Ember.Component.extend({
  canInvite: Ember.computed('currentUser.roles.[]', function() {
    const organizationUrl = this.get('organization.data.links.self');

    // TODO: Could show this if user has platform or compliance owner roles OR
    // even an admin membership in a specific role AFTER the invite drop-down
    // filters correctly according to the currentUser's role memberships
    return this.get('currentUserRoles')
            .filterBy('data.links.organization', organizationUrl)
            .filterBy('isAccountOwner').length > 0;
  })
});
