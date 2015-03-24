import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['verified-user-alert'],
  store: Ember.inject.service(),

  sending: false,
  sent: false,
  error: null,
  isDisabled: Ember.computed.or('sending', 'sent'),

  actions: {
    resendVerification: function(){
      this.setProperties({ sending: true, error: null });

      let reset = this.get('store').createRecord('reset', {type:'verification_code'});
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
