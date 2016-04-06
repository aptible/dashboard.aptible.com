import Ember from 'ember';
import c3 from 'c3';
import config from "diesel/config/environment";

function ensurePromise(x) {
    return new Ember.RSVP.Promise(function(resolve) {
        resolve(x);
    });
}

function withObservedChartAttribute(attrName, handler) {
  return Ember.observer(attrName, function () {
    ensurePromise(this.get(attrName)).then((attrValue) => {
      if (Ember.isEmpty(attrValue)) {
        return;
      }

      return handler.bind(this, attrValue)();
    });
  });
}

export default Ember.Component.extend({
  tagName: 'div',
  classNames: ['c3-chart-component'],

  init() {
    this._super(...arguments);

    // Create promises that'll create the chart
    ["Data", "Axis", "Grid", "Element"].forEach((attr) => {
      this.set(`_waitFor${attr}`, new Ember.RSVP.Promise((resolve) => {
        this.set(`_submitInitial${attr}`, (x) => {
          // Store the value and resolve the promise, but don't resolve the promise:
          // the value must be looked up via the stored values (because they can change
          // if another property takes a while to show up).
          this.set(`_valueFor${attr}`, x);
          resolve();
        });
      }));
    });

    Ember.RSVP.hash({
      data: this.get('_waitForData'),
      axis: this.get('_waitForAxis'),
      grid: this.get('_waitForGrid'),
      bindto: this.get('_waitForElement')
    }).then(() => {
      let chartConfig = {
        data: this.get('_valueForData'),
        axis: this.get('_valueForAxis'),
        grid: this.get('_valueForGrid'),
        bindto: this.get('_valueForElement')
      };

      // We need to disable transitions during test (they make tests flakey).
      if (config.environment === "test") {
        chartConfig.transition = { duration: null };
      }

      let chart = c3.generate(chartConfig);
      this.set('_chart', chart);
    });
  },

  didInsertElement() {
    this._super(...arguments);

    this.get('_submitInitialElement')(this.$().get(0));
    this.dataDidChange();
    this.gridDidChange();
    this.axisDidChange();
  },

  willDestroyElement() {
    /* This is not elegant, but unfortunately, it's needed. We need to delay
     * destroying the c3 chart element (which delete all of its attributes),
     * otherwise running transitions might crash. In practice, this is not an
     * issue for end-users (at worst, `window.onerror` will be called, and they
     * won't even know...), but in testing, it is an issue: tests will
     * routinely crash when a transition attempts to complete after the object
     * has been torn down.
     *
     * Ideally, we would use callbacks to ensure we don't attempt to destroy
     * the element while transitions are running. Unfortunately, this is not
     * possible, because c3.js exposes a single onrendered callback we can use
     * to be notified when transitions end, but we can't differentiate between
     * multiple transitions, so if we schedule two transitions in a short
     * timespan (which could happen e.g. when we render memory limits), then we
     * end up thinking all our transitions have completed although perhaps only
     * one did.
     *
     * Now, we could use the same callbacks to ensure we don't schedule a
     * transition if we already scheduled one, but at this point we're adding a
     * substantial amount of complexity, and we run the risk of locking up the
     * chart if for some reason the onrendered callback isn't called (which
     * seems possible considering c3.js makes no guarantees as to when this
     * callback will be called), which doesn't seem worth if the only upside is
     * saving a few seconds on running tests.
     */
    Ember.run.later(() => {
      let chart = this.get('_chart');
      if (chart) {
        chart.destroy();
        if (!this.isDestroyed) {
          this.set('_chart', null);
        }
      }
    }, 500);
  },

  dataDidChange: withObservedChartAttribute('data', function(data) {
    if (Ember.keys(data).length === 0) {
      // Do not attempt to render with no data (which is fine for other attributes)
      return;
    }

    this._applyToChart(() => {
      this.get('_submitInitialData')(data);
    }, (chart) => {
      data.unload = true;
      chart.load(data);
    });
  }),

  gridDidChange: withObservedChartAttribute('grid', function(grid) {
    this._applyToChart(() => {
      this.get('_submitInitialGrid')(grid);
    }, (chart) => {
      ["x", "y"].forEach((axis) => {
        if (grid[axis] && grid[axis].lines) {
          chart[`${axis}grids`](grid[axis].lines);
        }
      });
    });
  }),

  axisDidChange: withObservedChartAttribute('axis', function(axis) {
    this._applyToChart(() => {
      this.get('_submitInitialAxis')(axis);
    }, (chart) => {
      // TODO: Support more options?
      chart.axis.max(axis.y.max);
    });
  }),

  _applyToChart(noChartCallback, updateChartCallback) {
    let chart = this.get('_chart');
    if (!chart) {
      noChartCallback();
      return;
    }

    updateChartCallback(chart);
  }
});
