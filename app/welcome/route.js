import Ember from 'ember';

export default Ember.Route.extend({
  beforeModel: function() {
    if(!this.session.get('isAuthenticated')) {
      this.replaceWith('login');
    }
  }
});
