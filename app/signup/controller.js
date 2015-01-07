import Ember from "ember";
import EmberValidations from "ember-validations";

export default Ember.Controller.extend(EmberValidations.Mixin, {
  hasSubmitted: false,

  validations: {
    'organization.name': {
      presence: true,
      length: { minimum: 5 }
    }
  },

  actions: {

    signup: function(){
      var hasSubmitted = this.get('hasSubmitted');
      if (!hasSubmitted) {
        this.set('hasSubmitted', true);
      }
      var controller = this;
      this.validate().then(function(){
        var user = controller.get('model');
        var organization = controller.get('organization');
        controller.get('target').send('signup', user, organization);
      }).catch(function(){
        // Silence the validation exception
      });
    }

  }

});
