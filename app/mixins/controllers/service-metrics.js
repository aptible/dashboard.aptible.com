import Ember from 'ember';

export default Ember.Mixin.create({
  targetContainers: Ember.computed.filter("model.service.currentRelease.containers", function (container) {
    return container.get("layer") === this.getTargetLayer();
  }),

  horizonIsOneHour: Ember.computed.equal("model.uiState.dataHorizon", "1h"),
  horizonIsOneDay: Ember.computed.equal("model.uiState.dataHorizon", "1d"),

  actions: {
    setOneHourHorizon: function() {
      this.setHorizon("1h");
    },
    setOneDayHorizon: function() {
      this.setHorizon("1d");
    },
    reload: function() {
      this.set("model.uiState.lastReload", Date.now());
    }
  },

  setHorizon: function(horizon) {
    this.set("model.uiState.dataHorizon", horizon);
  }
});
