import Ember from "ember";
import EmberValidations from "ember-validations";

export default Ember.Controller.extend(EmberValidations.Mixin, {
  hasSubmitted: false,

  validations: {
    'model.password': {
      presence: true,
      confirmation: { message: 'does not match password' },
      'password-complexity': true
    }
  },

  actions: {

    save: function(model){
      var hasSubmitted = this.get('hasSubmitted');
      if (!hasSubmitted) {
        this.set('hasSubmitted', true);
      }
      this.validate().then(() => {
        this.get('target').send('save', model);
      }).catch(function(){
        // Silence the validation exception
      });
    }

  }

});
