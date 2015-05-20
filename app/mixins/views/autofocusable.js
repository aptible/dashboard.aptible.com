import Ember from 'ember';

export default Ember.Mixin.create({
  fixAutofocus: Ember.on('didInsertElement', function(){
    if (this.get('autofocus')) {
      this.$().focus();
    }
  })
});
