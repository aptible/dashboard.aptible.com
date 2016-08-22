import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'span',
  classNames: ['input-group-addon'],
  /** @type {Boolean} Whether errors will show even if no value */
  hasSubmitted: false,
  isSaving: false,
  value: false,

  // Converting model state into easy computed properties
  hasValue: Ember.computed.bool('value'),
  hasError: Ember.computed.bool('errorText'),
  noError: Ember.computed.not('showError'),
  notSaving: Ember.computed.not('isSaving'),
  canValidate: Ember.computed.or('hasValue', 'hasSubmitted'),

  // Computed used to determine visibility of different indicators using above
  // computed properties
  showSuccess: Ember.computed.and('notSaving', 'canValidate', 'noError'),
  showError: Ember.computed.and('notSaving', 'canValidate', 'hasError'),
  showSomething: Ember.computed.or('showSuccess', 'showError'),
  showNothing: Ember.computed.not('showSomething'),

  errorText: Ember.computed('error.[]', 'fieldName', function() {
    let error = this.get('error');
    let fieldName = this.get('fieldName');

    // If multiple errors, join errors with space and comma
    if(Array.isArray(error) && error.join) {
      error = error.join(', ');
    }

    if(fieldName && error) {
      error = `${fieldName} ${error}`;
    }

    return error;
  })
});

