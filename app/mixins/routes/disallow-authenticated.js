import Ember from "ember";

// If a user is authenticated, redirect them to `/`. If they
// are not authenticated, allow them to continue.
export default Ember.Mixin.create({
  requireAuthentication: false,
  beforeModel: function(){

    return new Ember.RSVP.Promise((resolve, reject) => {
      var isAuthenticated = this.get('session.isAuthenticated');
      if (isAuthenticated) {
        reject();
      } else if (isAuthenticated === undefined) {
        return this.session.fetch('aptible').then(reject, resolve);
      } else {
        resolve();
      }
    }).catch(() => {
      this.transitionTo('index');
    });
  }

});
