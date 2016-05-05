import Ember from 'ember';

export default Ember.Component.extend({
  tagName: '',
  errors: Ember.computed('attestation.validationErrors.[]', function() {
    let allErrors = this.get('attestation.validationErrors');
    let path = this.get('property.documentPath');
    return allErrors.filterBy('path', path);
  })
});