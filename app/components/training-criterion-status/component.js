import Ember from 'ember';

export default Ember.Component.extend({
  subjects: Ember.computed('criterion.handle', 'organization.developers.[]', 'organization.securityOfficer', function() {
    let criterion = this.get('criterion');
    return criterion.getOrganizationSubjects(this.get('organization'));
  })
});
