import Ember from 'ember';

export default Ember.Component.extend({
  store: null,

  sending: false,
  sent: false,
  error: null,
  isDisabled: Ember.computed.or('sending', 'sent'),

  actions: {
    resendVerification: function(){
      let store = this.get('store');
      Ember.assert('verification-code-reset must have store', !!store);

      this.setProperties({ sending: true, error: null });

      let reset = store.createRecord('reset', {type:'verification_code'});
      reset.save().then( () => {
        this.set('sent', true);
      }, (e) => {
        this.set('error', e);
      }).finally( () => {
        this.set('sending', false);
      });
    }
  }
});
