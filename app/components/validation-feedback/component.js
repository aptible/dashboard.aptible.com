import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'span',
  classNames: ['input-group-addon'],

  /** @type {Boolean} Whether errors will show even if no value */
  hasSubmitted: false,

  shouldShowFeedback: Ember.computed.or("value", "hasSubmitted"),

  errorText: Ember.computed("error.[]", "fieldName", function() {
    var error = this.get("error");
    var fieldName = this.get('fieldName');

    // If multiple errors, join errors with space and comma
    if(Array.isArray(error) && error.join) {
      error = error.join(", ");
    }

    if(fieldName && error) {
      error = `${fieldName} ${error}`;
    }

    return error;
  })
});

