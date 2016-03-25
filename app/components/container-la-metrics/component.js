import Ember from 'ember';
import ContainerMetricsComponentMixin from "diesel/mixins/components/container-metrics";

export default Ember.Component.extend(ContainerMetricsComponentMixin, {
  metric: "la",
  axisLabel: "Load average",
  axisFormatter: (v) => v
});
