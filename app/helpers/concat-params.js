import Ember from 'ember';

export function concatParams(params/*, hash*/) {
  return params.join('');
}

export default Ember.Helper.helper(concatParams);
