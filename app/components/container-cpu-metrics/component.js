import Ember from 'ember';
import ContainerMetricsComponentMixin from "diesel/mixins/components/container-metrics";

export default Ember.Component.extend(ContainerMetricsComponentMixin, {
  metric: "cpu",
  axisLabel: "CPU usage",
  axisFormatter: (v) => `${v}% CPU`,
});
