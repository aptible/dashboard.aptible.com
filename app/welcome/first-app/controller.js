import Ember from "ember";
import config from "../../config/environment";
import EmberValidationsMixin from "ember-validations/mixin";

export default Ember.Controller.extend(EmberValidationsMixin, {
  hasSubmitted: false,
  validations: {
    'model.stackHandle': {
      presence: true,
      format: {
        with: /^([a-zA-Z]|\d|[_\-])+$/,
        allowBlank: false,
        message: 'must be letters, numbers, and hyphens only'
      },
      uniqueness: {
        message: 'is taken.',
        paramName: 'handle',
        url: `${config.apiBaseUri || ''}/claims/account`
      }
    },
    'model.appHandle': {
      uniqueness: {
        message: 'is taken.',
        paramName: 'handle',
        url: `${config.apiBaseUri || ''}/claims/app`
      }
    },
    'model.dbHandle': {
      uniqueness: {
        message: 'is taken.',
        paramName: 'handle',
        url: `${config.apiBaseUri || ''}/claims/database`
      }
    }
  },
  actions: {
    create: function(){
      this.validate().then(() => {
        // model data is already stored on the parent
        // route (welcome). Just move forward.

        this.transitionToRoute('welcome.payment-info');
      }).catch(() => {
        // Silence the validation exception, display it in UI
      });
    },
  }
});
