import Ember from 'ember';

export default Ember.Component.extend({
  subjects: Ember.computed('criterion', 'organization.developers.[]', 'organization.securityOfficer', function() {
    let organization = this.get('organization');
    return organization.getCriterionSubjects(this.get('criterion'));
  })
});
