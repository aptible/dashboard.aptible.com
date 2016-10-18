import Ember from 'ember';

export default Ember.Component.extend({
  tagName: '',
  propertyKey: Ember.computed('parentKey', 'key', function() {
    let { parentKey, key } = this.getProperties('parentKey', 'key');
    let propertyKey = key;

    if(parentKey) {
      propertyKey = `${parentKey}.${key}`;
    }

    return propertyKey;
  }),

  errors: Ember.computed('attestation.validationErrors.[]', function() {
    let allErrors = this.get('attestation.validationErrors');
    let path = this.get('property.documentPath');

    return allErrors.filterBy('path', path);
  })
});