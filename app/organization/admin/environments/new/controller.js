import Ember from "ember";
import config from "../../../config/environment";
import EmberValidationsMixin from "ember-validations/mixin";

export default Ember.Controller.extend(EmberValidationsMixin, {
  allowPHI: false,

  disableSave: Ember.computed.or('hasError', 'isPending'),
  isPending: Ember.computed.or('model.isSaving', 'model.isValidating'),
  hasError: Ember.computed.gt('errors.model.handle.length', 0),

  validations: {
    'model.handle': {
      uniqueness: {
        message: 'is taken.',
        paramName: 'handle',
        url: `${config.apiBaseUri || ''}/claims/account`
      }
    }
  }
});
