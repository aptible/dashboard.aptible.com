import Ember from 'ember';

export default Ember.Component.extend({
  subjects: Ember.computed('criterion.handle', 'organization.developers.[]', 'organization.securityOfficer', function() {
    let organization = this.get('organization');

    if(this.get('criterion.handle') === 'training_log') {
      return organization.get('users.content');
    }

    return organization.getCriterionSubjects(this.get('criterion'));
  })
});
