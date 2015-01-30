import Ember from 'ember';

export default Ember.Component.extend({
  isConfirmed: null,
  isUnconfirmed: Ember.computed.not('isConfirmed'),
  input: function(){
    var enteredValue = this.get('enteredValue');
    var confirmValue = this.get('confirmValue');
    this.set('isConfirmed', enteredValue === confirmValue);
  }.on('init'),
  actions: {
    submit: function(){
      if (this.get('isConfirmed')) {
        this.sendAction();
      }
    }
  }
});
