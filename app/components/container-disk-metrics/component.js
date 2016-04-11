import Ember from 'ember';
import ContainerMetricsComponentMixin from "diesel/mixins/components/container-metrics";

export default Ember.Component.extend(ContainerMetricsComponentMixin, {
  metric: "fs",
  axisLabel: "Disk usage",
  axisFormatter: (v) => `${v} GB`,
  axisBottomPadding: 0  // Disk usage is always > 0, no need for extra padding
});
