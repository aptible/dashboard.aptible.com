import Ember from "ember";
import ServiceMetricsRouteMixin from 'diesel/mixins/routes/service-metrics';

export default Ember.Route.extend(ServiceMetricsRouteMixin, {
  getService: function() {
    return this.modelFor('database').get('service');
  },

  actions: {
    close() {
      this.transitionTo('database');
    }
  }
});
