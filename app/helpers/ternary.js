import Ember from 'ember';

/**
 * Returns alt if subject is falsey.
 */
export default Ember.Helper.helper(function([ subject, alt ]) {
  if (subject) {
    return subject;
  }
  return alt;
});
