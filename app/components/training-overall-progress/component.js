import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['panel', 'white-panel', 'progress-radial-panel'],
  classNameBindings: ['isComplete:green-progress-radial', 'isIncomplete:red-progress-radial'],
  isIncomplete: Ember.computed.not('isComplete'),
  isComplete: Ember.computed('subjectCount', 'compliantSubjectCount', function() {
    return this.get('subjectCount') === this.get('compliantSubjectCount');
  }),
  subjects: Ember.computed('criteria.[]', 'organization.users.[]', 'organization.developers.[]', 'organization.securityOfficer', function() {
    let criteria = this.get('criteria');
    let organization = this.get('organization');

    return organization.getCriteriaSubjects(criteria);
  }),

  compliantSubjects: Ember.computed('criteria.@each.documents', 'subjects', function() {
    let compliantSubjects = [];
    let criteria = this.get('criteria');
    let organization = this.get('organization');

    criteria.forEach((criterion) => {
      let subjects = organization.getCriterionSubjects(criterion);
      let compliant = subjects.filter((subject) => {
        return criterion.getSubjectStatus(subject, organization).green;
      });

      compliant.forEach((s) => {
        compliantSubjects.push(s);
      });
    });

    return compliantSubjects;
  }),

  subjectCount: Ember.computed.reads('subjects.length'),
  compliantSubjectCount: Ember.computed.reads('compliantSubjects.length')
});
