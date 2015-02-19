import Ember from 'ember';

export default Ember.Route.extend({
  requireAuthentication: false,
  title: 'Aptible Dashboard',

  afterModel: function(){
    this.analytics.identify();
    var route = this;
    this.session.addObserver('currentUser', function(){
      var email = route.get('currentUser.email');
      route.analytics.identify(email);
    });
  }
});
