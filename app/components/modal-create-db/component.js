import Ember from 'ember';
import config from "../../config/environment";
import EmberValidationsMixin from "ember-validations/mixin";

export default Ember.Component.extend(EmberValidationsMixin, {
  newDb: null,
  disableSave: Ember.computed.or('hasError', 'isPending'),
  isPending: Ember.computed.or('newDb.isSaving', 'newDb.isValidating'),
  hasError: Ember.computed.gt('errors.newDb.handle.length', 0),
  title: Ember.computed('stack.handle', function() {
    return `Create a new database on ${this.get('stack.handle')}`;
  }),

  description: Ember.computed('stack.allowPHI', function () {
    if(this.get('stack.allowPHI')) {
      return `${this.get('stack.handle')} is a dedicated environment. Databases
              created in this environment are safe for regulated data.`;
    }

    return `${this.get('stack.handle')} is a shared environment.  Databases created
            in this environment are NOT safe for regulated data.`;
  }),

  dismissOnSave: Ember.observer('newDb.isNew', function() {
    if(this.get('newDb.isNew') === false) {
      this.sendAction('dismiss');
      this.set('dismissOnSave', Ember.$.noop);
    }
  }),

  validations: {
    'newDb.handle': {
      uniqueness: {
        message: 'is taken.',
        paramName: 'handle',
        url: `${config.apiBaseUri || ''}/claims/database`
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
      this.get('newDb').rollback();
      this.sendAction('dismiss');
    },

    createDb() {
      let db = this.get('newDb');
      this.sendAction('onCreateDb', db);
    },

    outsideClick: Ember.K,

    didSlide(val) {
      this.set('diskSize', val);
    },

    selectDbType(type) {
      this.set('newDb.type', type);
    },

    imageSelected(type) {
      this.set('newDb.databaseImage', type);
    }
  }
});
