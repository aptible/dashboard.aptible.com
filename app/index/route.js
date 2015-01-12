import Ember from 'ember';

export default Ember.Route.extend({
  requireAuthentication: false,

  redirect: function() {
    var route = this;

    if (this.session.get('isAuthenticated')) {
      route.transitionTo('apps');
    } else {
      route.transitionTo('login');
    }
  }
});
