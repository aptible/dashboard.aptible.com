import Ember from 'ember';

export default Ember.Mixin.create({
  fixAutofocus: function(){
    if (this.get('autofocus')) {
      this.$().focus();
    }
  }.on('didInsertElement')
});
