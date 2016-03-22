import Ember from 'ember';
import ContainerMetricsComponentMixin from "diesel/mixins/components/container-metrics";

export default Ember.Component.extend(ContainerMetricsComponentMixin, {
  init() {
    this._super(...arguments);
    this.set("uiState.showMemoryLimit", false);
  },

  metric: "memory",
  axisLabel: "Memory usage",
  axisFormatter: (v) => `${v} MB`,

  gridLines: Ember.computed("minMemoryLimit" , function () {
    let minMemoryLimit = this.get("minMemoryLimit"),
        gridLines = [];

    if (minMemoryLimit < Infinity) {
      gridLines.push({
        value: minMemoryLimit,
        text: `Memory limit (${minMemoryLimit} MB)`
      });
    }

    return gridLines;
  }),

  axisMax: Ember.computed("minMemoryLimit", "uiState.showMemoryLimit", function () {
    let showMemoryLimit = this.get("uiState.showMemoryLimit"),
        minMemoryLimit = this.get("minMemoryLimit");

    if (showMemoryLimit && minMemoryLimit < Infinity) {
      return minMemoryLimit;
    }
  }),

  allMemoryLimits: Ember.computed.mapBy("containers", "memoryLimit"),
  applicableMemoryLimits: Ember.computed.filter("allMemoryLimits", (memoryLimit) => (!Ember.isEmpty(memoryLimit)) && memoryLimit > 0),

  minMemoryLimit: Ember.computed.min("applicableMemoryLimits"),
  hasMemoryLimit: Ember.computed.lt("minMemoryLimit", Infinity)
});
