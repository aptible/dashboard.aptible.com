import Ember from 'ember';

/**
 * Converts to TB (assumes input in GB)
 */
export default Ember.Helper.helper(function([ gb ]) {
  return gb * 0.001;
});
