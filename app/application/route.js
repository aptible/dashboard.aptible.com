import Ember from 'ember';

export default Ember.Route.extend({
  beforeModel: function(){
    if (!this.session.get('isAuthenticated')) {
      return this.session.fetch('aptible').catch(function(){
        // no-op; it's ok if we're not logged in
      });
    }
  }
});
