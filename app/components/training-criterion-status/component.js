import Ember from 'ember';

export default Ember.Component.extend({
  subjects: Ember.computed('criterion.handle', 'organization.developers.[]', 'organization.securityOfficer', function() {
    let organization = this.get('organization');
    debugger;
    return organization.getCriterionSubjects(this.get('criterion'));
  })
});
