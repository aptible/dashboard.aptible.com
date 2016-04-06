import Ember from "ember";
import ServiceMetricsRouteMixin from 'diesel/mixins/routes/service-metrics';

export default Ember.Route.extend(ServiceMetricsRouteMixin, {
  getService: function(params) {
    return this.store.find('service', params.service_id);
  },

  actions: {
    close() {
      this.transitionTo('app.services.index');
    }
  }
});
