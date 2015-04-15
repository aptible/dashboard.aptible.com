import Ember from 'ember';
import DisallowAuthenticated from "diesel/mixins/routes/disallow-authenticated";
import SignupRouteMixin from "diesel/mixins/routes/signup";

export default Ember.Route.extend(DisallowAuthenticated, SignupRouteMixin, {
  queryParams: {
    plan: { }
  },
  setupController: function(controller){
    let user = this.store.createRecord('user');
    let organization = this.store.createRecord('organization');

    controller.set('model', user);
    controller.set('organization', organization);
  }
});
