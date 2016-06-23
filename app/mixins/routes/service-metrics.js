import Ember from 'ember';

export default Ember.Mixin.create({
  model: function(params) {
    return Ember.Object.create({
      resource: this.getResource(params),
      service: this.getService(params),
      uiState: this.defaultUiState()
    });
  },

  defaultUiState: function() {
    return Ember.Object.create({
      dataHorizon: "1h",
      lastReload: Date.now()
    });
  }
});
