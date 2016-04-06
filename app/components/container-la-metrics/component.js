import Ember from 'ember';
import ContainerMetricsComponentMixin from "diesel/mixins/components/container-metrics";

export default Ember.Component.extend(ContainerMetricsComponentMixin, {
  metric: "la",
  axisLabel: "Load average",
  axisFormatter: (v) => {
    // Don't show negative values on the axis (those can come up due to padding)
    if (v >= 0) {
      return v;
    }
  }
});
