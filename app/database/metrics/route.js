import Ember from "ember";
import ServiceMetricsRouteMixin from 'diesel/mixins/routes/service-metrics';

export default Ember.Route.extend(ServiceMetricsRouteMixin, {
  getResource: function() {
    return this.modelFor('database');
  },

  getService: function() {
    return this.getResource().get('service');
  }
});
