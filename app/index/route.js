import Ember from 'ember';

export default Ember.Route.extend({
  redirect: function() {
    var route = this;

    if (this.session.get('isAuthenticated')) {
      route.transitionTo('apps');
    } else {
      route.transitionTo('login');
    }
  }
});
