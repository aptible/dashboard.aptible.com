import Ember from 'ember';

export default Ember.Route.extend({
  redirect() {
    var route = this;
    var dashboard = this.modelFor('dashboard');
    var user = this.session.get('currentUser');

    if (dashboard.stacks.get('length') === 0) { return; }

    var canReadPromises = dashboard.stacks.map(function(stack) {
      return user.can('read', stack);
    });

    return new Ember.RSVP.all(canReadPromises).then(function(canReadValues) {
      var isRestricted = !canReadValues.reduce(function(prev, cur) {
        return prev || cur;
      });
      user.set('isRestricted', isRestricted);
      if (isRestricted) {
        route.transitionTo('trainee-dashboard');
      }
    });
  }
});
