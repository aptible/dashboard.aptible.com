import Ember from 'ember';

export default Ember.TextField.extend({
  _dasherizedValue: null,
  value: Ember.computed(function(key, value){
    if (arguments.length > 1) {
      if (value && typeof value === 'string') {
        this._dasherizedValue = value.dasherize();
      } else {
        this._dasherizedValue = value;
      }
      return this._dasherizedValue;
    } else {
      return this._dasherizedValue;
    }
  })
});
