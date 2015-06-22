import Ember from 'ember';
import DevelopmentUsersComputedMixin from '../../mixins/components/development-users-computed';

export default Ember.Component.extend(DevelopmentUsersComputedMixin, {
  subjects: Ember.computed('criterion.handle', 'developmentUsers', 'organization.users.[]', 'organization.securityOfficer', function() {
    let handle = this.get('criterion.handle');

    if(handle === 'developer_training_log') {
      return this.get('developmentUsers');
    } else if(handle === 'security_officer_training_log') {
      return [this.get('organization.securityOfficer')];
    } else {
      return this.get('organization.users');
    }
  })
});
