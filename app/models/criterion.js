import Ember from 'ember';
import DS from 'ember-data';

export default DS.Model.extend({
  handle: DS.attr('string'),
  name: DS.attr('string'),
  description: DS.attr('string'),
  scope: DS.attr('string'),
  evidenceType: DS.attr('string'),
  documents: DS.hasMany('document', {async:true}),

  friendlyName: Ember.computed('name', function() {
    let currentName = this.get('name');
    let handle = this.get('handle');

    if(handle === 'training_log') {
      return 'Basic Training';
    }

    if(/training_log/.test(handle)) {
      return currentName.replace('Log', '');
    }

    return currentName;
  }),

  getOrganizationSubjects(organization) {
    let prop = { training_log: 'users',
                 developer_training_log: 'developers',
                 security_officer_training_log: 'securityOfficer'}[this.get('handle')];

    return Ember.makeArray(organization.get(prop));
  },

  getSubjectStatus(subject, organization) {
    // FIXME: This method assumes documents are already loaded.  Instead
    // It should be promise-based and resolve unloaded documents before
    // generating a status

    let scopeKey = { user: 'userUrl', app: 'appUrl' }[this.get('scope')];
    let subjectUrl = subject.get('data.links.self');
    let organizationUrl = organization.get('data.links.self');

    let subjectDocuments = this.get('documents').filter((d) => {
      if(d.get('organizationUrl') !== organizationUrl) {
        // Users can belong to multiple organizations, so be sure to only
        // include documents related to the current organization
        return false;
      }

      return d.get(scopeKey) === subjectUrl;
    });

    if(subjectDocuments.get('length') > 0) {
      let lastDocument = this.get('documents').objectAt(0);
      return { green: true, completedOn: lastDocument.get('createdAt'),
               nextAssessment: lastDocument.get('nextAssessment'),
               lastDocument: lastDocument };
    } else {
      return { green: false, completedOn: 'Never',
               nextAssessment: 'Immediately' };
    }
  }
});
