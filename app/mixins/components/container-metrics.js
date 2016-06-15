import Ember from 'ember';
import { formatUtcTimestamp } from 'diesel/helpers/format-utc-timestamp';

export default Ember.Mixin.create({
  metricsApi: Ember.inject.service(),

  init() {
    this._super(...arguments);
    this.set("uiState", Ember.Object.create({
      statusMessage: null,
      statusLevel: null
    }));
  },

  data: Ember.computed("containers.[]", "horizon", "lastReload", "metric", function () {
    let horizon = this.get("horizon");
    let containers = this.get("containers");

    if (containers.get("length") === 0) {
      // We did not load the containers yet (or this release has no containers).
      this.setStatus("Waiting for containers", "warning");
      return;
    }

    this.setStatus("Loading data...", "success");

    return this.get("metricsApi").fetchMetrics(containers, horizon, this.get("metric"))
    .then((data) => {
      this.clearStatus();
      return data;
    })
    .catch((e) => {
      this.setStatus(e.message, "danger");
      throw e;
    });
  }),

  grid: Ember.computed("gridLines" , function () {
    return Ember.RSVP.hash({
      gridLines: this.get("gridLines")
    }).then((h) => {
      return {
        y: {
          lines: h.gridLines
        }
      };
    });
  }),

  axis: Ember.computed("axisLabel", "axisFormatter", "axisBottomPadding", "axisMax", function () {
    return Ember.RSVP.hash({
      axisLabel: this.get("axisLabel"),
      axisFormatter: this.get("axisFormatter"),
      axisBottomPadding: this.getWithDefault("axisBottomPadding", null),
      axisMax: this.get("axisMax")
    }).then((h) => {
      let axis = {
        x: {
          type: 'timeseries',
          tick: {
            format: formatUtcTimestamp,
            culling: {
              max: 4
            }
          }
        },
        y: {
          min: 0,
          padding: {
            bottom: h.axisBottomPadding
          },
          label: {
            text: h.axisLabel,
            position: "outer-top"
          },
          tick: {
            format: h.axisFormatter
          }
        }
      };

      if (h.axisMax) {
        axis.y.max = h.axisMax;
      }

      return axis;
    });
  }),

  setStatus: function(statusMessage, statusLevel) {
    this.set("uiState.statusMessage", statusMessage);
    this.set("uiState.statusLevel", statusLevel);
  },

  clearStatus: function() {
    this.setStatus(null, null);
  }
});
