import Ember from 'ember';
import config from "../../config/environment";
import EmberValidationsMixin from "ember-validations/mixin";

export default Ember.Component.extend(EmberValidationsMixin, {
  newApp: null,
  disableSave: Ember.computed.or('hasError', 'isPending'),
  isPending: Ember.computed.or('newApp.isSaving', 'newApp.isValidating'),
  hasError: Ember.computed.gt('errors.newApp.handle.length', 0),
  title: Ember.computed('stack.handle', function() {
    return `Create a new app on ${this.get('stack.handle')}`;
  }),

  description: Ember.computed('stack.allowPHI', function () {
    if(this.get('stack.allowPHI')) {
      return `${this.get('stack.handle')} is a dedicated environment. Apps
              created in this environment are safe for regulated data.`;
    }

    return `${this.get('stack.handle')} is a shared environment.  Apps created
            in this environment are NOT safe for regulated data.`;
  }),

  dismissOnSave: Ember.observer('newApp.isNew', function() {
    if(this.get('newApp.isNew') === false) {
      if (!this.isDestroyed) {
        console.log("DISMISSING");
        this.sendAction('dismiss');
      }
    }
  }),

  validations: {
    'newApp.handle': {
      uniqueness: {
        message: 'is taken.',
        paramName: 'handle',
        url: `${config.apiBaseUri || ''}/claims/app`
      }
    }
  },

  focusHandle: Ember.on('didInsertElement', function() {
    Ember.run.later(() => {
      this.$('input').eq(0).focus();
    });
  }),

  actions: {
    onDismiss() {
      this.get('newApp').rollback();
    },

    createApp() {
      let app = this.get('newApp');
      this.sendAction('onCreateApp', app);
    },

    outsideClick: Ember.K
  }
});
