import Ember from 'ember';

export function capitalizeString([input]) {
  return Ember.String.capitalize(input || '');
}

export default Ember.Helper.helper(capitalizeString);
