import Ember from 'ember';

export default Ember.Route.extend({
  requireAuthentication: false,

  redirect: function() {
    var route = this;

    if (this.session.get('isAuthenticated')) {
      route.replaceWith('stacks');
    } else {
      route.replaceWith('login');
    }
  }
});
