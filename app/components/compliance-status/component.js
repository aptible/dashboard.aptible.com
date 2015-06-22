import Ember from 'ember';

export default Ember.Component.extend({
  complianceValidator: Ember.inject.service(),
  tagName: '', // tagName must be exactly '' to render this component with no surrounding tag

  subject: null,
  criterion: null,
  status: Ember.computed('subject', 'criterion.documents.[]', 'organization', function() {
    if (this.get('isDestroyed')) {
      return;
    }

    let subject = this.get('subject');
    let criterion = this.get('criterion');
    let organization = this.get('organization');

    Ember.assert("You must provide a subject to compliance-status", !!subject);
    Ember.assert("You must provide a criterion to compliance-status", !!criterion);
    Ember.assert("You must provide an organization to compliance-status", !!organization);

    return criterion.getSubjectStatus(subject, organization);
  })
});
