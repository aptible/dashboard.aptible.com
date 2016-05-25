import Ember from 'ember';
import ContainerMetricsComponentMixin from "diesel/mixins/components/container-metrics";

export default Ember.Component.extend(ContainerMetricsComponentMixin, {
  metric: "iops",
  axisLabel: "IOPS",

  gridLines: Ember.computed("baselineIops", function() {
    const baselineIops = this.get("baselineIops");

    return [{
      value: baselineIops,
      text: `Volume baseline performance (${baselineIops} IOPS)`
    }];
  }),

  axisMax: Ember.computed("baselineIops", "data", function() {
    return Ember.RSVP.hash({
      baselineIops: this.get("baselineIops"),
      data: this.get("data")
    }).then((h) => {
      // We want to show both the baseline IOPS performance and all the data we
      // have.
      let axisMax = h.baselineIops;

      // Data isn't necessarily data from the API yet: if the controller is
      // just initializing, it could be empty. Similar logic is found in the
      // c3-chart component's dataDidChange handler.
      if (h.data) {
        // The structure is prepared for c3, which means our columns include both
        // timestamps and data. However, we can easily identify the data columns
        // by the fact that they have a corresponding timestamp column. So, we
        // iterate over all columns and for those that have a corresponding
        // timestamp column, look for their maximum.
        for (let i = 0; i < (h.data.columns || []).length; i++) {
          let column = h.data.columns[i];
          let columnName = column[0];
          if (h.data.xs[columnName]) {
            for (let j = 1; j < column.length; j++) {
              if (column[j] > axisMax) {
                axisMax = column[j];
              }
            }
          }
        }
      }

      // Finally, we add some padding here to avoid craming the layout.
      return Math.round(axisMax * 1.1);
    });
  }),

  axisFormatter: (v) => {
    // Don't show negative values on the axis (those can come up due to padding)
    if (v >= 0) {
      return v;
    }
  },
});
