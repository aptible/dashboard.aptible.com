import Ember from 'ember';

// NOTE: {{plural}} is already a built-in Ember helper and
// we cannot override it here, so this helper is called `plural-string`
// instead.
export function pluralString([input, count]) {
  if (count === 1) { return input; }
  return Ember.String.pluralize(input);
}

export default Ember.Helper.helper(pluralString);
