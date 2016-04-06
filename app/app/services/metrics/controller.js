import Ember from 'ember';
import ServiceMetricsControllerMixin from 'diesel/mixins/controllers/service-metrics';

export default Ember.Controller.extend(ServiceMetricsControllerMixin, {
  getTargetLayer: () => "app"
});
