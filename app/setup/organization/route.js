import Ember from 'ember';
import SPDRouteMixin from 'sheriff/mixins/routes/spd-route';

export default Ember.Route.extend(SPDRouteMixin, {
  model() {
    return this.modelFor('setup');
  }
});
