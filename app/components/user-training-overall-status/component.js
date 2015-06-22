import Ember from 'ember';
import DevelopmentUsersComputedMixin from '../../mixins/components/development-users-computed';

export default Ember.Component.extend(DevelopmentUsersComputedMixin, {
  complianceValidator: Ember.inject.service(),
  classNames: ['panel-row', 'user-training-status'],
  requiredCriteria: Ember.computed('user', 'criteria.[]', 'developmentUsers.[]', function() {
    return this.get('criteria').filter((c) => {
      return this.subjectTo(c);
    });
  }),

  overallTrainingStatus: Ember.computed('criteria.@each.documents', 'user', 'organization', function() {
    let criteria = this.get('criteria');
    let subject = this.get('user');
    let organization = this.get('organization');
    let green = this.get('complianceValidator').areAllCriteriaCompliant(criteria, subject, organization);

    return { green };
  }),

  subjectTo(criterion) {
    let handle = criterion.get('handle');
    let organization;
    let developmentUsers;
    let userHref;

    if(handle === 'training_log') {
      return true;
    }

    if(handle === 'security_officer_training_log') {
      organization = this.get('organization');
      userHref = this.get('user.data.links.self');

      return organization.get('data.links.securityOfficer') === userHref;
    }

    if (handle === 'developer_training_log') {
      userHref = this.get('user.data.links.self');
      let developmentUsers = this.get('developmentUsers').map((u) => {
        return u.get('data.links.self');
      });

      return developmentUsers.indexOf(userHref) >= 0;
    }
  }
});
