import Ember from 'ember';

export default Ember.Component.extend({
  complianceValidator: Ember.inject.service(),
  classNames: ['panel-row', 'user-training-status'],

  requiredCriteria: Ember.computed('user', 'criteria.[]', 'organization.developers.[]', function() {
    return this.get('criteria').filter((c) => {
      return this.isSubjectTo(c);
    });
  }),

  overallTrainingStatus: Ember.computed('criteria.@each.documents', 'user', 'organization', function() {
    let criteria = this.get('criteria');
    let subject = this.get('user');
    let organization = this.get('organization');
    let green = this.get('complianceValidator').areAllCriteriaCompliant(criteria, subject, organization);

    return { green };
  }),

  isSubjectTo(criterion) {
    let organization = this.get('organization');
    let subjects = organization.getCriterionSubjects(criterion);
    let userHref = this.get('user.data.links.self');

    return subjects.map((s) => s.get('data.links.self')).indexOf(userHref) >= 0;
  }
});
