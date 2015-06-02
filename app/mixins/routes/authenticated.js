import Ember from 'ember';

// Pre-loading user roles minimizes the number of HTTP
// requests we have to make later when checking a user's ability
// to read/manage/etc a stack
function loadUserRoles(route){
  var user = route.session.get('currentUser');
  return user.get('roles');
}

export default Ember.Mixin.create({
  requireAuthentication: true, // default to requiring authentication
  unauthenticatedRedirect: 'login',

  beforeModel(transition) {
    if (this.get('requireAuthentication')) {
      return this._requireAuthentication(transition);
    } else {
      return this._checkLogin();
    }
  },

  // redirect if the user is not signed in
  _requireAuthentication(transition) {
    var route = this;
    var isAuthenticated = this.get('session.isAuthenticated');
    if (isAuthenticated === undefined) {
      this.session.attemptedTransition = transition;
      return this.session.fetch('aptible').then(function(){
        return loadUserRoles(route);
      }).catch( () => {
        route.transitionTo(Ember.get(this, 'unauthenticatedRedirect'));
      });
    } else if (isAuthenticated) {
      return loadUserRoles(route);
    } else {
      route.transitionTo(Ember.get(this, 'unauthenticatedRedirect'));
    }
  },

  // check if the user is signed in, but do nothing if they are not
  _checkLogin() {
    var isAuthenticated = this.get('session.isAuthenticated');
    if (isAuthenticated === undefined) {
      return this.session.fetch('aptible').catch(function(){
        // no-op; it's ok if we are not logged in
      });
    } else {
      return Ember.RSVP.resolve();
    }
  }
});
