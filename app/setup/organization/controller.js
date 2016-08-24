import Ember from 'ember';
import EmberValidationsMixin from "ember-validations/mixin";

let validations = {
    'model.aboutOrganization': { presence: true },
    'model.aboutProduct': { presence: true, minimum: 3 },
    'model.aboutArchitecture': { presence: true },
    'model.aboutBusinessModel': { presence: true },
    'model.aboutTeam': { presence: true },
    'model.aboutGoToMarket': { presence: true }
  };

let validationKeys = Ember.keys(validations).map((k) => `errors.${k}`);

export default Ember.Controller.extend(EmberValidationsMixin, {
  hasErrors: Ember.computed.apply(this, validationKeys.concat(function() {
    return Ember.keys(this.get('errors.model')).any((prop) => {
      return this.get('errors.model.' + prop).length > 0;
    });
  })),

  errorText: Ember.computed('hasErrors', function() {
    if(this.get('hasErrors')) {
      return 'All fields are required';
    }
  }),

  hasSubmitted: false,
  validations
});

