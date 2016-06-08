import Ember from 'ember';

export default Ember.Route.extend({
  redirect() {
    this.transitionTo('risk-assessment.threat_events');
  }
});
