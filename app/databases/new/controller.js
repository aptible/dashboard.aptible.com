import Ember from 'ember';
import config from "../../config/environment";
import EmberValidationsMixin from "ember-validations/mixin";

export default Ember.Controller.extend(EmberValidationsMixin, {
  stack: Ember.inject.controller('stack'),
  showCancelButton: Ember.computed.gt('stack.persistedDatabases.length', 0),
  diskSize: 10,

  disableSave: Ember.computed.or('hasError', 'isPending'),
  isPending: Ember.computed.or('model.isSaving', 'model.isValidating'),
  hasError: Ember.computed.gt('errors.model.handle.length', 0),

  validations: {
    'model.handle': {
      uniqueness: {
        message: 'is taken.',
        paramName: 'handle',
        url: `${config.apiBaseUri || ''}/claims/database`
      }
    }
  },

  actions: {
    didSlide: function(val){
      this.set('diskSize', val);
    },

    selectDbType: function(type){
      this.set('model.type', type);
    },

    imageSelected: function(type){
      this.set('model.databaseImage', type);
    }
  }
});
