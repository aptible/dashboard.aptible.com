import Ember from 'ember';
import { STEPS } from '../../components/spd-nav/component';
import SPDRouteMixin from 'sheriff/mixins/routes/spd-route';

export default Ember.Route.extend(SPDRouteMixin, {
  model() {
    return STEPS;
  }
});
