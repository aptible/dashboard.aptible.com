import Ember from 'ember';

export default Ember.Component.extend({
  metricsApi: Ember.inject.service(),

  init() {
    this._super(...arguments);
    this.set("uiState", Ember.Object.create({
      showMemoryLimit: false,
      statusMessage: null,
      statusLevel: null
    }));
  },

  data: Ember.computed("containers.@each", "horizon", "lastReload", function () {
    let horizon = this.get("horizon");
    let containers = this.get("containers");

    if (containers.get("length") === 0) {
      // We did not load the containers yet (or this release has no containers).
      this.setStatus("Waiting for containers", "warning");
      return;
    }

    this.setStatus("Loading data...", "success");

    return this.get("metricsApi").fetchMetrics(containers, horizon)
    .then((data) => {
      this.clearStatus();
      return data;
    })
    .catch((e) => {
      this.setStatus(e.message, "danger");
      throw e;
    });
  }),

  grid: Ember.computed("minMemoryLimit" , function () {
    let grid = {
      y: {
        lines: []
      }
    };

    let minMemoryLimit = this.get("minMemoryLimit");

    if (minMemoryLimit < Infinity) {
      grid.y.lines.push({
        value: minMemoryLimit,
        text: `Memory limit (${minMemoryLimit} MB)`
      });
    }

    return grid;
  }),

  axis: Ember.computed("minMemoryLimit", "uiState.showMemoryLimit", function () {
    let axis = {
      x: {
        type: 'timeseries',
        tick: {
          format: '%H:%M:%S'
        }
      },
      y: {
        min: 0,
        padding: {
          bottom: 0
        },
        label: {
          text: "Memory usage",
          position: "outer-top"
        },
        tick: {
          format: (v) => `${v} MB`
        }
      }
    };

    let showMemoryLimit = this.get("uiState.showMemoryLimit"),
        minMemoryLimit = this.get("minMemoryLimit");

    if (showMemoryLimit && minMemoryLimit < Infinity) {
      axis.y.max = minMemoryLimit;
    }

    return axis;
  }),

  allMemoryLimits: Ember.computed.mapBy("containers", "memoryLimit"),
  applicableMemoryLimits: Ember.computed.filter("allMemoryLimits", (memoryLimit) => (!Ember.isEmpty(memoryLimit)) && memoryLimit > 0),

  minMemoryLimit: Ember.computed.min("applicableMemoryLimits"),
  hasMemoryLimit: Ember.computed.lt("minMemoryLimit", Infinity),

  setStatus: function(statusMessage, statusLevel) {
    this.set("uiState.statusMessage", statusMessage);
    this.set("uiState.statusLevel", statusLevel);
  },

  clearStatus: function() {
    this.setStatus(null, null);
  }
});
