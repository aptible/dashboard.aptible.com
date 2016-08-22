import Ember from 'ember';

export function concatParams(params/*, hash*/) {
  return params.join('');
}

export default Ember.HTMLBars.makeBoundHelper(concatParams);
