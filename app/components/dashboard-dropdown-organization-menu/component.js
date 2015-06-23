import Ember from 'ember';

export default Ember.Component.extend({
  organizationPath: Ember.computed('organization.id', function() {
    // Link directly to members to prevent a redirect that breaks the back
    // button

    return `organizations/${this.get('organization.id')}/members`;
  })
});
