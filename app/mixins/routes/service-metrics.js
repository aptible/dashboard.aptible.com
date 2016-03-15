import Ember from 'ember';

export default Ember.Mixin.create({
  model: function(params) {
    return Ember.Object.create({
      service: this.getService(params),
      uiState: this.defaultUiState()
    });
  },

  defaultUiState: function() {
    return Ember.Object.create({
      showMemoryLimit: false,
      dataHorizon: "1h",
      lastReload: Date.now(),
      statusMessage: null,
      statusLevel: "alert"
    });
  }
});
