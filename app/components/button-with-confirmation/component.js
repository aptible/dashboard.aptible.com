import Ember from 'ember';

export default Ember.Component.extend({
  isConfirmed: null,
  isUnconfirmed: Ember.computed.not('isConfirmed'),
  input: Ember.on('init', function(){
    var enteredValue = this.get('enteredValue');
    var confirmValue = this.get('confirmValue');
    this.set('isConfirmed', enteredValue === confirmValue);
  }),
  actions: {
    submit: function(){
      if (this.get('isConfirmed')) {
        this.sendAction();
      }
    }
  }
});
