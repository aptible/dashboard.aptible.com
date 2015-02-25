import Ember from "ember";
import EmberValidations from "ember-validations";

export default Ember.Controller.extend(EmberValidations.Mixin, {
  hasSubmitted: false,

  validations: {
    'model.email': {
      email: true
    }
  },

  actions: {

    reset: function(model){
      var hasSubmitted = this.get('hasSubmitted');
      if (!hasSubmitted) {
        this.set('hasSubmitted', true);
      }
      this.validate().then(() => {
        this.get('target').send('reset', model);
      }).catch(function(){
        // Silence the validation exception
      });
    }

  }

});
