import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['panel', 'white-panel', 'progress-radial-panel'],
  classNameBindings: ['isComplete:green-progress-radial', 'isIncomplete:red-progress-radial'],
  isIncomplete: Ember.computed.not('isComplete'),
  isComplete: Ember.computed('subjectCount', 'compliantSubjectCount', function() {
    return this.get('subjectCount') === this.get('compliantSubjectCount');
  }),
  subjects: Ember.computed('criterion', 'organization.developers.[]', 'organization.securityOfficer', 'organization.users.[]', function() {
    let criterion = this.get('criterion');
    let organization = this.get('organization');

    return organization.getCriterionSubjects(criterion);
  }),

  compliantSubjects: Ember.computed('criterion.documents.[]', 'subjects', function() {
    let criterion = this.get('criterion');
    let subjects = this.get('subjects');
    let organization = this.get('organization');

    return subjects.filter((subject) => {
      return criterion.getSubjectStatus(subject, organization).green;
    });

  }),

  subjectCount: Ember.computed.reads('subjects.length'),
  compliantSubjectCount: Ember.computed.reads('compliantSubjects.length')
});
