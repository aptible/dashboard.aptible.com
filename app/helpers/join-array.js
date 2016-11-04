import Ember from 'ember';

export function joinArray([array, divider]) {
  return array.join(divider);
}

export default Ember.Helper.helper(joinArray);
