import Ember from "ember";

// If a user is authenticated, redirect them to `/`. If they
// are not authenticated, allow them to continue.
export default Ember.Mixin.create({
  requireAuthentication: false,
  beforeModel: function(){
    return new Ember.RSVP.Promise((resolve, reject) => {
      if (this.session.get('isAuthenticated')) {
        reject();
      } else {
        this.session.fetch('aptible').then(reject, resolve);
      }
    }).catch(() => {
      this.transitionTo('index');
    });
  }

});
