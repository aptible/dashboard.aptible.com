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

  beforeModel: function(){
    if (this.get('requireAuthentication')) {
      return this._requireAuthentication();
    } else {
      return this._checkLogin();
    }
  },

  // redirect to 'login' if the user is not signed in
  _requireAuthentication: function(){
    var route = this;
    if (!this.session.get('isAuthenticated')) {
      return this.session.fetch('aptible').then(function(){
        return loadUserRoles(route);
      }).catch(function(){
        route.transitionTo('login');
      });
    } else {
      return loadUserRoles(route);
    }
  },

  // check if the user is signed in, but do nothing if they are not
  _checkLogin: function(){
    if (!this.session.get('isAuthenticated')) {
      return this.session.fetch('aptible').catch(function(){
        // no-op; it's ok if we are not logged in
      });
    } else {
      return Ember.RSVP.resolve();
    }
  }
});
