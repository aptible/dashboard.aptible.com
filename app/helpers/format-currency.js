import Ember from 'ember';

/**
 * Takes money values in cents and returns a value in dollars
 * 123456789 will return $1,234,567.89
 * 12345 will return $123.45
 * 1 will return $0.01
 */
export default Ember.Helper.helper(function([ input ]) {
  return '$' + (input / 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
});
