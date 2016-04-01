import Ember from 'ember';
import c3 from 'c3';
import config from "diesel/config/environment";

function ensurePromise(x) {
    return new Ember.RSVP.Promise(function(resolve) {
        resolve(x);
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
      let chart = this.get('_chart');
      if (chart) {
        chart.destroy();
        this.set('_chart', null);
      }
  },

  dataDidChange: Ember.observer('data', function() {
    ensurePromise(this.get('data')).then((data) => {
      if (Ember.isEmpty(data) || Ember.keys(data).length === 0) {
        return;
      }

      let chart = this.get('_chart');
      if (chart) {
        data.unload = true;
        chart.load(data);
      } else {
        this.get('_submitInitialData')(data);
      }
    });
  }),

  gridDidChange: Ember.observer('grid', function () {
    ensurePromise(this.get('grid')).then((grid) => {
      if (Ember.isEmpty(grid)) {
        return;
      }

      let chart = this.get('_chart');
      if (chart) {
        ["x", "y"].forEach((axis) => {
          if (grid[axis] && grid[axis].lines) {
            chart[`${axis}grids`](grid[axis].lines);
          }
        });
      } else {
        this.get('_submitInitialGrid')(grid);
      }
    });
  }),

  axisDidChange: Ember.observer('axis', function () {
    ensurePromise(this.get('axis')).then((axis) => {
      if (Ember.isEmpty(axis)) {
        return;
      }

      let chart = this.get('_chart');
      if (chart) {
        // TODO: Support more options?
        chart.axis.max(axis.y.max);
      } else {
        this.get('_submitInitialAxis')(axis);
      }
    });
  })
});
