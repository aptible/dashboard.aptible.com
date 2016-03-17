import Ember from 'ember';
import ajax from 'diesel/utils/ajax';
import config from 'diesel/config/environment';

export default Ember.Mixin.create({
  data: Ember.computed("targetContainers", "model.uiState.dataHorizon", "model.uiState.lastReload", function () {
    let accessToken = this.get("session.token").get("accessToken");

    let dataHorizon = this.get("model.uiState.dataHorizon");
    let cids = this.get("targetContainers").map((container) => container.get("dockerName"));

    if (cids.length === 0) {
      // We did not load the containers yet (or this release has no containers).
      this.setStatus("Waiting for containers", "warning");
      return;
    }

    this.setStatus("Loading data...", "success");
    return ajax(`${config.metricsBaseuri}/${cids.join(":")}?horizon=${dataHorizon}`, {
      headers: {
        "Authorization": `Bearer ${accessToken}`
      }
    })
    .then((data) => {
      this.clearStatus();
      return data;
    })
    .catch((e) => {
      let error;
      if (e.status === 404) {
        error = "No data available!";
      } else {
        error = "Unknown error occurred";
      }
      this.setStatus(error, "danger");
      return;
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

  axis: Ember.computed("minMemoryLimit", "model.uiState.showMemoryLimit", function () {
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

    let showMemoryLimit = this.get("model.uiState.showMemoryLimit"),
        memoryLimit = this.get("minMemoryLimit");

    if (showMemoryLimit && memoryLimit < Infinity) {
      axis.y.max = memoryLimit;
    }

    return axis;
  }),

  targetContainers: Ember.computed.filter("model.service.currentRelease.containers", function (container) {
    return container.get("layer") === this.getTargetLayer();
  }),

  allMemoryLimits: Ember.computed.mapBy("targetContainers", "memoryLimit"),
  applicableMemoryLimits: Ember.computed.filter("allMemoryLimits", (memoryLimit) => (!Ember.isEmpty(memoryLimit)) && memoryLimit > 0),

  minMemoryLimit: Ember.computed.min("applicableMemoryLimits"),
  hasMemoryLimit: Ember.computed.lt("minMemoryLimit", Infinity),

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
  },

  setStatus: function(statusMessage, statusLevel) {
    this.set("model.uiState.statusMessage", statusMessage);
    this.set("model.uiState.statusLevel", statusLevel);
  },

  clearStatus: function() {
    this.setStatus(null, null);
  }
});

