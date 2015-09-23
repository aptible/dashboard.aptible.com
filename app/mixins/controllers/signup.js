import Ember from 'ember';
import EmberValidationsMixin from "ember-validations/mixin";
import config from "../../config/environment";

export default Ember.Mixin.create(EmberValidationsMixin, {
  isSaving: false,
  hasSubmitted: false,

  validateOrganization(){
    return !!this.get('organization');
  },

  validations: {
    'organization.name': {
      presence: { 'if': 'validateOrganization' },
      length: {
        'if': 'validateOrganization',
        minimum: 3
      }
    },
    'model.name': {
      presence: true,
      length: { minimum: 3 }
    },
    'model.email': {
      presence: true,
      email: true,
      uniqueness: {
        message: 'is in use.',
        url: `${config.authBaseUri || ''}/claims/user`
      }
    },
    'model.password': {
      presence: true,
      'password-complexity': true
    }
  },

  actions: {
    validateAndSignup() {
      let hasSubmitted = this.get('hasSubmitted');
      if (!hasSubmitted) {
        this.set('hasSubmitted', true);
      }

      this.validate().then(() => {
        let user = this.get('model');

        // will not be present if the user is signing up
        // to accept an invitation
        let organization = this.get('organization');

        this.get('target').send('signup', user, organization);
      }).catch(() => {
        // Silence the validation exception, display it in UI
      });
    }
  }
});
