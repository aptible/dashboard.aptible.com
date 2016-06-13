import Ember from 'ember';

const makeComputedToggle = function(enabledValue, disabledValue) {
  return Ember.computed('otpEnabled', function() {
    const otpEnabled = this.get("otpEnabled");
    return otpEnabled ? enabledValue : disabledValue;
  });
};

export default Ember.Component.extend({
  tagName: '',

  label: makeComputedToggle('Enabled', 'Disabled'),
  color: makeComputedToggle('success', 'danger'),
  icon: makeComputedToggle('check', 'times')
});
