import Ember from 'ember';

export default Ember.Component.extend({
  schema: Ember.computed.alias('securityControlGroup.schema'),
  document: Ember.computed.alias('securityControlGroup.schemaDocument'),
  provider: Ember.computed.alias('securityControlGroup.provider'),
  attestation: Ember.computed.alias('securityControlGroup.attestation'),
  isLoading: Ember.computed.alias('securityControlGroup.isLoading'),
  validationErrors: Ember.computed.alias('attestation.errors.firstObject.message'),
  showStatusBar: Ember.computed('attestation.isSaving', 'validationErrors', 'saveMessage', function() {
    return this.get('attestation.isSaving') || this.get('validationErrors') || this.get('saveMessage');
  }),

  willDestroyElement() {
    // https://github.com/ember-animation/liquid-fire/issues/310
    // This will clean up hanging $.data that can lead to memory leakage
    if (this._prevLiquid) {
      this._prevLiquid.remove();
    }

    this._prevLiquid = this.$('.liquid-child');
    this.$('.liquid-child').removeData();
    this.$('.liquid-container').removeData();
  },

  actions: {
    next() {
      this.sendAction('onNext');
    },

    previous() {
      this.sendAction('onPrevious');
    },

    save() {
      this.sendAction('onSave');
    }
  }
});

