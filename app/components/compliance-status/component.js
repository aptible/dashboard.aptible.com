import Ember from 'ember';

export default Ember.Component.extend({
  status: {},
  tagName: '', // tagName must be exactly '' to render this component with no surrounding tag

  subject: null,
  criterion: null,

  checkStatus: Ember.on('willInsertElement', function() {
    if (this.get('isDestroyed')) {
      return;
    }

    let subject = this.get('subject');
    let criterion = this.get('criterion');

    Ember.assert("You must provide a subject to compliance-status", !!subject);
    Ember.assert("You must provide a criterion to compliance-status", !!criterion);

    let scopeKey = { user: 'userUrl', app: 'appUrl' }[criterion.get('scope')];
    let subjectUrl = subject.get('data.links.self');
    let subjectDocuments = criterion.get('documents').filter((d) => {
      return d.get(scopeKey) === subjectUrl;
    });

    if(subjectDocuments.get('length') > 0) {
      let lastDocument = criterion.get('documents').objectAt(0);
      this.set('status', { green: true, completedOn: lastDocument.get('createdAt'),
                           nextAssessment: lastDocument.get('nextAssessment') });
    } else {
      this.set('status', { green: false, completedOn: 'Never',
                           nextAssessment: 'Immediately' });
    }
  })
});
